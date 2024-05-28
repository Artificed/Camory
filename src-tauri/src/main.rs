// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use bcrypt::verify;
use mysql::prelude::*;
use mysql::*;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tauri::State;
use uuid::Uuid;
use chrono::NaiveDateTime;

impl MySQLConfig {
    fn new(username: String, password: String, host: String, database: String) -> Self {
        MySQLConfig {
            username,
            password,
            host,
            database,
        }
    }

    fn format_url(&self) -> String {
        format!(
            "mysql://{}:{}@{}/{}",
            self.username, self.password, self.host, self.database
        )
    }
}

struct MySQLConfig {
    username: String,
    password: String,
    host: String,
    database: String,
}

#[tauri::command]
fn register(
    email: String,
    password: String,
    username: String,
    mysql_pool: State<Arc<Pool>>,
) -> Result<(), String> {
    let user_id = Uuid::new_v4().to_string();
    let hashed_password = match bcrypt::hash(password, bcrypt::DEFAULT_COST) {
        Ok(hashed) => hashed,
        Err(_) => return Err("Failed to hash password".into()),
    };

    let mut conn = mysql_pool
        .get_conn()
        .map_err(|_| "Failed to get connection")?;

    conn.exec_drop(
        "INSERT INTO users (id, email, password, username) VALUES (:id, :email, :password, :username)",
        params! {
            "id" => user_id,
            "email" => email,
            "password" => hashed_password,
            "username" => username,
        },
    )
    .map_err(|_| "Failed to insert user into database")?;

    Ok(())
}

#[derive(Serialize, Deserialize, Clone)]

struct User {
    id: String,
    email: String,
    password: String,
    username: String,
}

struct CurrentUser {
    user: Mutex<Option<User>>,
}

#[tauri::command]
fn login(
    username: &str,
    password: &str,
    mysql_pool: State<Arc<Pool>>,
    current_user: State<Arc<CurrentUser>>,
) -> bool {
    let mut conn: PooledConn = mysql_pool.get_conn().expect("Failed to get connection");
    let result: Option<(String, String, String, String)> = conn
        .exec_first(
            "SELECT id, username, password, email
        FROM users
        WHERE username = :username",
            params! {
                "username" => username,
            },
        )
        .expect("Failed to execute query");

    if let Some((id, username, stored_password, email)) = result {
        if verify(password, &stored_password).unwrap() {
            let user = User {
                id,
                email,
                password: stored_password,
                username,
            };
            *current_user.user.lock().unwrap() = Some(user);
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

#[tauri::command]
fn get_current_user(current_user: State<Arc<CurrentUser>>) -> Option<User> {
    current_user.user.lock().unwrap().clone()
}

#[derive(Serialize, Deserialize, Clone)]
struct Deck {
    id: String,
    name: String,
    user_id: String,
    new_cards_per_day: i16,
    cards: Vec<Card>,
}

#[derive(Serialize, Deserialize, Clone)]
struct Card {
    id: String,
    deck_id: String,
    status: String,
    ease: f32,
    fails: i16,
    streak: i16,
    previous_due: NaiveDateTime,
    due: NaiveDateTime,
    content: Option<CardContent>,
}

#[derive(Serialize, Deserialize, Clone)]
struct CardContent {
    card_id: String,
    vocabulary: String,
    clue: String,
    asset: String,
    definition: String,
    description: String,
}

#[tauri::command]
fn get_card_content(card_id: String, mysql_pool: &State<Arc<Pool>>) -> Option<CardContent> {
    let mut conn = mysql_pool.get_conn().expect("Failed to get connection");

    let result: Option<(String, String, String, String, String, String)> = conn
        .exec_first(
            "SELECT card_id, vocabulary, clue, asset, definition, description
             FROM card_contents
             WHERE card_id = :card_id",
            params! {
                "card_id" => card_id,
            },
        )
        .expect("Failed to execute query");

    result.map(
        |(card_id, vocabulary, clue, asset, definition, description)| CardContent {
            card_id,
            vocabulary,
            clue,
            asset,
            definition,
            description,
        },
    )
}

fn parse_naive_datetime(datetime_str: &str) -> NaiveDateTime {
    NaiveDateTime::parse_from_str(datetime_str, "%Y-%m-%d %H:%M:%S").expect("Failed to parse date")
}

fn get_cards_for_deck(deck_id: String, mysql_pool: &State<Arc<Pool>>) -> Vec<Card> {
    let mut conn = mysql_pool.get_conn().expect("Failed to get connection");
    conn.exec_map(
        "SELECT id, deck_id, status, ease, fails, streak, CAST(previous_due AS CHAR) AS previous_due, CAST(due AS CHAR) AS due
         FROM cards
         WHERE deck_id = :deck_id",
        params! {
            "deck_id" => deck_id,
        },
        |(id, deck_id, status, ease, fails, streak, previous_due, due): (
            String,
            String,
            String,
            f64,
            i32,
            i32,
            String,
            String,
        )| {
            let content = get_card_content(id.clone(), mysql_pool);
            Card {
                id,
                deck_id,
                status,
                ease: ease as f32,
                fails: fails as i16,
                streak: streak as i16,
                previous_due: parse_naive_datetime(&previous_due),
                due: parse_naive_datetime(&due),
                content,
            }
        },
    )
    .expect("Failed to execute query for cards")
}

#[tauri::command]
fn get_deck_by_id(deck_id: String, mysql_pool: State<Arc<Pool>>) -> Option<Deck> {
    let mut conn = mysql_pool.get_conn().expect("Failed to get connection");
    let result: Option<(String, String, String, i16)> = conn.exec_first(
        "SELECT id, user_id, name, new_cards_per_day
         FROM decks
         WHERE id = :deck_id",
        params! {
            "deck_id" => deck_id,
        },
    ).expect("Failed to execute query");
    result.map(|(id, user_id, name, new_cards_per_day)| {
        let cards = get_cards_for_deck(id.clone(), &mysql_pool);
        Deck {
            id,
            user_id,
            name,
            cards,
            new_cards_per_day,
        }
    })
}

#[tauri::command]
fn get_decks(user_id: String, mysql_pool: State<Arc<Pool>>) -> Vec<Deck> {
    let mut conn = mysql_pool.get_conn().expect("Failed to get connection");
    let decks: Vec<Deck> = conn
        .exec_map(
            "SELECT id, user_id, name, new_cards_per_day
             FROM decks
             WHERE user_id = :user_id",
            params! {
                "user_id" => user_id,
            },
            |(id, user_id, name, new_cards_per_day): (String, String, String, i16)| {
                let id_clone = id.clone(); // Clone the id value
                let cards = get_cards_for_deck(id_clone, &mysql_pool); // Fetch cards for the current deck
                Deck {
                    id,
                    user_id,
                    name,
                    cards,
                    new_cards_per_day,
                }
            },
        )
        .expect("Failed to execute query");
    decks
}

#[tauri::command]
fn create_deck(
    deck_name: String,
    current_user: State<Arc<CurrentUser>>,
    mysql_pool: State<Arc<Pool>>,
) -> Result<(), String> {
    let user = current_user.user.lock().unwrap();
    if let Some(user) = &*user {
        let user_id = user.id.clone();
        let id = Uuid::new_v4().to_string();
        let mut conn = mysql_pool.get_conn().map_err(|err| {
            let error_message = format!("Failed to get connection: {}", err);
            println!("{}", error_message);
            error_message
        })?;

        conn.exec_drop(
            "INSERT INTO decks (id, user_id, name, new_cards_per_day) VALUES (:id, :user_id, :name, :new_cards_per_day)",
            params! {
                "id" => id,
                "user_id" => user_id,
                "name" => deck_name,
                "new_cards_per_day" => 20,
            },
        )
        .map_err(|err| {
            let error_message = format!("Failed to insert deck into database: {}", err);
            error_message
        })?;

        Ok(())
    } else {
        Err("No current user".into())
    }
}

#[tauri::command]
fn insert_card_content(
    card_id: String,
    vocabulary: String,
    clue: String,
    asset: String, // The asset is a base64 encoded string
    definition: String,
    description: String,
    mysql_pool: State<Arc<Pool>>,
) -> Result<(), String> {
    let mut conn = mysql_pool
        .get_conn()
        .map_err(|e| format!("Failed to get connection: {:?}", e))?;
    let result = conn.exec_drop(
        "INSERT INTO card_contents (card_id, vocabulary, clue, asset, definition, description)
        VALUES (:card_id, :vocabulary, :clue, :asset, :definition, :description)",
        params! {
            "card_id" => &card_id,
            "vocabulary" => vocabulary,
            "clue" => clue,
            "asset" => asset,
            "definition" => definition,
            "description" => description,
        },
    );

    if let Err(e) = result {
        return Err(format!("Failed to insert into card contents: {:?}", e));
    }

    Ok(())
}

#[tauri::command]
fn insert_card(
    deck_id: String,
    vocabulary: String,
    clue: String,
    asset: String, // The asset is a base64 encoded string
    definition: String,
    description: String,
    mysql_pool: State<Arc<Pool>>,
) -> Result<(), String> {
    let mut conn = mysql_pool
        .get_conn()
        .map_err(|e| format!("Failed to get connection: {:?}", e))?;

    let id = Uuid::new_v4().to_string();
    let result_card = conn.exec_drop(
        "INSERT INTO cards (id, deck_id, status)
        VALUES (:id, :deck_id, :status)",
        params! {
            "id" => &id,
            "deck_id" => deck_id,
            "status" => "new"
        },
    );

    if let Err(e) = result_card {
        return Err(format!("Failed to insert into cards: {:?}", e));
    }

    if let Err(e) = insert_card_content(id, vocabulary, clue, asset, definition, description, mysql_pool) {
        return Err(format!("Failed to insert into card content: {:?}", e));
    }

    Ok(())
}

#[tauri::command]
fn fail_learning_card(
    card_id: String,
    mysql_pool: State<Arc<Pool>>,
) -> Result<(), String> {
    let mut conn = mysql_pool
        .get_conn()
        .map_err(|e| format!("Failed to get connection: {:?}", e))?;
    let result_card = conn.exec_drop(
        "UPDATE cards
        SET status = 'learning', previous_due = CURRENT_TIMESTAMP, due = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 MINUTE)
        WHERE id = :id",
        params! {
            "id" => card_id
        },
    );
    if let Err(e) = result_card {
        return Err(format!("Failed to update card: {:?}", e));
    }
    Ok(())
}

#[tauri::command]
fn pass_new_card(
    card_id: String,
    mysql_pool: State<Arc<Pool>>,
) -> Result<(), String> {
    let mut conn = mysql_pool
        .get_conn()
        .map_err(|e| format!("Failed to get connection: {:?}", e))?;
    let result_card = conn.exec_drop(
        "UPDATE cards
        SET status = 'learning', previous_due = CURRENT_TIMESTAMP, due = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 MINUTE)
        WHERE id = :id",
        params! {
            "id" => card_id
        },
    );
    if let Err(e) = result_card {
        return Err(format!("Failed to update card: {:?}", e));
    }
    Ok(())
}


fn main() {
    let mysql_config = MySQLConfig::new(
        "root".to_string(),
        "".to_string(),
        "localhost".to_string(),
        "camory".to_string(),
    );
    let mysql_url = mysql_config.format_url();
    let pool = Pool::new(&*mysql_url).expect("Failed getting pool.");

    let current_user = CurrentUser {
        user: Mutex::new(None),
    };

    let pool = Arc::new(pool);
    let current_user = Arc::new(current_user);

    tauri::Builder::default()
        .manage(pool) // Make the MySQL pool available to Tauri commands
        .manage(current_user) // Make the current user state available to Tauri commands
        .invoke_handler(tauri::generate_handler![
            login,
            register,
            get_current_user,
            get_decks,
            create_deck,
            insert_card_content,
            insert_card,
            get_deck_by_id,
            fail_learning_card,
            pass_new_card,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
