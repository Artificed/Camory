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
    cards: Vec<UserCard>,
}

#[derive(Serialize, Deserialize, Clone)]
struct Card {
    id: String,
    vocabulary: String,
    clue: String,
    asset: String,
    definition: String,
    description: String, 
}

#[derive(Serialize, Deserialize, Clone)]
struct UserCard {
    id: String,
    deck_id: String,
    card_id: String,
    status: String,
    ease: f32,
    fails: i16,
    streak: i16,
    review_time: NaiveDateTime,
    due: NaiveDateTime,
    content: Option<Card>,
}

#[tauri::command]
fn get_card_content(card_id: String, mysql_pool: &State<Arc<Pool>>) -> Option<Card> {
    let mut conn = mysql_pool.get_conn().expect("Failed to get connection");

    let result: Option<(String, String, String, String, String, String)> = conn
        .exec_first(
            "SELECT id, vocabulary, clue, asset, definition, description
             FROM cards
             WHERE id = :card_id",
            params! {
                "card_id" => card_id,
            },
        )
        .expect("Failed to execute query");

    result.map(
        |(id, vocabulary, clue, asset, definition, description)| Card {
            id,
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

fn get_user_cards_for_deck(deck_id: String, mysql_pool: &State<Arc<Pool>>) -> Vec<UserCard> {
    let mut conn = mysql_pool.get_conn().expect("Failed to get connection");
    conn.exec_map(
        "SELECT id, deck_id, card_id, status, ease, fails, streak, CAST(review_time AS CHAR) AS review_time, CAST(due AS CHAR) AS due
         FROM user_cards
         WHERE deck_id = :deck_id",
        params! {
            "deck_id" => deck_id,
        },
        |(id, deck_id, card_id, status, ease, fails, streak, review_time, due): (
            String,
            String,
            String,
            String,
            f64,
            i32,
            i32,
            String,
            String,
        )| {
            let content: Option<Card> = get_card_content(card_id.clone(), mysql_pool);
            UserCard {
                id,
                deck_id,
                card_id,
                status,
                ease: ease as f32,
                fails: fails as i16,
                streak: streak as i16,
                review_time: parse_naive_datetime(&review_time),
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
        let cards = get_user_cards_for_deck(id.clone(), &mysql_pool);
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
                let cards = get_user_cards_for_deck(id_clone, &mysql_pool); // Fetch cards for the current deck
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

fn insert_card(
    vocabulary: String,
    clue: String,
    asset: String, // The asset is a base64 encoded string
    definition: String,
    description: String,
    mysql_pool: State<Arc<Pool>>,
) -> Result<String, String> {
    let mut conn = mysql_pool
        .get_conn()
        .map_err(|e| format!("Failed to get connection: {:?}", e))?;

    let id = Uuid::new_v4().to_string();

    let result = conn.exec_drop(
        "INSERT INTO cards (id, vocabulary, clue, asset, definition, description)
        VALUES (:id, :vocabulary, :clue, :asset, :definition, :description)",
        params! {
            "id" => &id,
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

    Ok(id)
}

#[tauri::command]
fn insert_user_card(
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

    let card_id = match insert_card(vocabulary, clue, asset, definition, description, mysql_pool) {
        Ok(card_id) => card_id,
        Err(e) => return Err(e),
    };

    let result_card = conn.exec_drop(
        "INSERT INTO user_cards (id, deck_id, card_id, status)
        VALUES (:id, :deck_id, :card_id, :status)",
        params! {
            "id" => &id,
            "deck_id" => deck_id,
            "card_id" => &card_id,
            "status" => "new",
        },
    );

    if let Err(e) = result_card {
        return Err(format!("Failed to insert into cards: {:?}", e));
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
        "UPDATE user_cards
        SET status = 'learning', review_time = CURRENT_TIMESTAMP, due = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 MINUTE)
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
        "UPDATE user_cards
        SET status = 'learning', review_time = CURRENT_TIMESTAMP, due = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 MINUTE)
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
fn pass_learning_card(
    card_id: String,
    mysql_pool: State<Arc<Pool>>,
) -> Result<(), String> {
    let mut conn = mysql_pool
        .get_conn()
        .map_err(|e| format!("Failed to get connection: {:?}", e))?;
    let result_card = conn.exec_drop(
        "UPDATE user_cards
        SET status =
                CASE
                    WHEN TIMESTAMPDIFF(MINUTE, review_time, due) = 60 THEN 'due'
                    ELSE 'learning'
                END,
            due = 
                CASE 
                    WHEN TIMESTAMPDIFF(MINUTE, review_time, due) = 1 THEN DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 MINUTE)
                    WHEN TIMESTAMPDIFF(MINUTE, review_time, due) = 10 THEN DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 60 MINUTE)
                    WHEN TIMESTAMPDIFF(MINUTE, review_time, due) = 60 THEN DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY)
                    ELSE due
                END,
            review_time = CURRENT_TIMESTAMP
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
fn pass_due_card(
    card_id: String,
    mysql_pool: State<Arc<Pool>>,
) -> Result<(), String> {
    let mut conn = mysql_pool
        .get_conn()
        .map_err(|e| format!("Failed to get connection: {:?}", e))?;
    let result_card = conn.exec_drop(
        "UPDATE user_cards
        SET streak = streak + 1,
            ease = 
                CASE
                    WHEN streak >= 3 AND ease != 2.5 THEN ROUND(ease + 0.05, 3)
                    ELSE ease
                END,
            due = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ROUND(TIMESTAMPDIFF(SECOND, review_time, due) * ease) SECOND),
            review_time = CURRENT_TIMESTAMP
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
fn pass_relearning_card(
    card_id: String,
    mysql_pool: State<Arc<Pool>>,
) -> Result<(), String> {
    let mut conn = mysql_pool
        .get_conn()
        .map_err(|e| format!("Failed to get connection: {:?}", e))?;
    let result_card = conn.exec_drop(
        "UPDATE user_cards
        SET streak = 
                CASE 
                    WHEN TIMESTAMPDIFF(MINUTE, review_time, due) = 60 THEN 1
                    ELSE 0
                END,
            status = 
                CASE
                    WHEN TIMESTAMPDIFF(MINUTE, review_time, due) = 60 THEN 'due'
                    ELSE 'relearning'
                END,
            due = 
                CASE
                    WHEN TIMESTAMPDIFF(MINUTE, review_time, due) = 10 THEN DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 60 MINUTE)
                    WHEN TIMESTAMPDIFF(MINUTE, review_time, due) = 60 THEN DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY)
                    ELSE due
                END,
            review_time = CURRENT_TIMESTAMP
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
fn fail_due_card(
    card_id: String,
    mysql_pool: State<Arc<Pool>>,
) -> Result<(), String> {
    let mut conn = mysql_pool
        .get_conn()
        .map_err(|e| format!("Failed to get connection: {:?}", e))?;
    let result_card = conn.exec_drop(
        "UPDATE user_cards
        SET streak = 0,
            fails = 
                CASE
                    WHEN status = 'due' THEN fails + 1
                    ELSE fails
                END,
            ease = 
                CASE
                    WHEN ease != 1.3 THEN ROUND(ease - 0.20, 3)
                    ELSE ease
                END,
            status = 
                CASE
                    WHEN fails = 6 THEN 'suspended'
                    ELSE 'relearning'
                END,
            due = 
                CASE 
                    WHEN status = 'suspended' THEN '2000-01-01 00:00:00'
                    ELSE DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 MINUTE)
                END,
            review_time = CURRENT_TIMESTAMP
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


#[derive(Serialize, Deserialize, Clone)]
struct GameCardChoice {
    answer: String,
    is_correct: bool,
    clicked_times: i32,
}

#[derive(Serialize, Deserialize, Clone)]
struct GameCard {
    id: String,
    game_id: String,
    card: Card,
    choices: Vec<GameCardChoice>,
}

#[derive(Serialize, Deserialize, Clone)]
struct Game {
    id: String,
    name: String,
    asset: String,
    game_cards: Vec<GameCard>,
}

#[derive(Serialize, Deserialize, Clone)]
struct GamePlayer {
    game_id: String,
    user_id: String,
    score: i32,
    correct_answers: i32,
    incorrect_answers: i32,
}

#[tauri::command]
fn get_cards_for_game(game_id: String, mysql_pool: State<Arc<Pool>>) -> Vec<GameCard> {
    let mut conn = mysql_pool.get_conn().expect("Failed to get connection");

    let game_cards: Vec<(String, String, String)> = conn
        .exec(
            "SELECT id, game_id, card_id 
            FROM game_cards 
            WHERE game_id = :game_id",
            params! {
                "game_id" => &game_id,
            },
        )
        .expect("Failed to execute query");

    let mut result: Vec<GameCard> = Vec::new();

    for (id, game_id, card_id) in game_cards {
        let card: Card = conn
            .exec_first(
                "SELECT id, vocabulary, clue, asset, definition, description 
                FROM cards 
                WHERE id = :card_id",
                params! {
                    "card_id" => &card_id,
                },
            )
            .expect("Failed to fetch card")
            .map(|(id, vocabulary, clue, asset, definition, description)| Card {
                id,
                vocabulary,
                clue,
                asset,
                definition,
                description,
            })
            .expect("Card not found");

        let choices: Vec<GameCardChoice> = conn
            .exec(
                "SELECT answer, is_correct, clicked_times 
                FROM game_card_choices 
                WHERE game_card_id = :game_card_id",
                params! {
                    "game_card_id" => &id,
                },
            )
            .expect("Failed to fetch choices")
            .into_iter()
            .map(|(answer, is_correct, clicked_times)| GameCardChoice {
                answer,
                is_correct,
                clicked_times,
            })
            .collect();

        result.push(GameCard {
            id,
            game_id,
            card,
            choices,
        });
    }

    result
}

#[tauri::command]
fn get_games(mysql_pool: State<Arc<Pool>>) -> Vec<Game> {
    let mut conn = mysql_pool.get_conn().expect("Failed to get connection");

    let games: Vec<(String, String, String)> = conn
        .exec("SELECT id, name, asset
        FROM games", ())
        .expect("Failed to execute query");

    let mut result: Vec<Game> = Vec::new();

    for (id, name, asset) in games {
        let game_cards = get_cards_for_game(id.clone(), mysql_pool.clone());
        result.push(Game {
            id,
            name,
            asset,
            game_cards,
        });
    }

    result
}

#[tauri::command]
fn register_game_player(
    game_id: String,
    current_user: State<Arc<CurrentUser>>,
    mysql_pool: State<Arc<Pool>>,
) -> Result<GamePlayer, String> {
    let user = current_user.user.lock().unwrap();
    if let Some(user) = &*user {
        let user_id = user.id.clone();
        let mut conn = mysql_pool.get_conn().map_err(|err| {
            let error_message = format!("Failed to get connection: {}", err);
            println!("{}", error_message);
            error_message
        })?;

        let existing_player: Option<(String, String, i32, i32, i32)> = conn.exec_first(
            "SELECT game_id, user_id, score, correct_answers, incorrect_answers 
             FROM game_players 
             WHERE game_id = :game_id AND user_id = :user_id",
            params! {
                "game_id" => &game_id,
                "user_id" => &user_id,
            },
        ).map_err(|err| {
            let error_message = format!("Failed to check existing game player: {}", err);
            println!("{}", error_message);
            error_message
        })?;

        if let Some((game_id, user_id, score, correct_answers, incorrect_answers)) = existing_player {
            Ok(GamePlayer {
                game_id,
                user_id,
                score,
                correct_answers,
                incorrect_answers,
            })
        } else {
            let score = 0;
            let correct_answers = 0;
            let incorrect_answers = 0;
            conn.exec_drop(
                "INSERT INTO game_players (game_id, user_id, score, correct_answers, incorrect_answers) 
                 VALUES (:game_id, :user_id, :score, :correct_answers, :incorrect_answers)",
                params! {
                    "game_id" => &game_id,
                    "user_id" => &user_id,
                    "score" => score,
                    "correct_answers" => correct_answers,
                    "incorrect_answers" => incorrect_answers,
                },
            ).map_err(|err| {
                let error_message = format!("Failed to create game player: {}", err);
                println!("{}", error_message);
                error_message
            })?;

            let game_player = GamePlayer {
                game_id,
                user_id,
                score,
                correct_answers,
                incorrect_answers,
            };

            Ok(game_player)
        }
    } else {
        Err("No current user".into())
    }
}

#[tauri::command]
fn get_user_card_ids(current_user: State<Arc<CurrentUser>>, mysql_pool: State<Arc<Pool>>) -> Result<Vec<String>, String> {
    let user = current_user.user.lock().unwrap();

    if let Some(user) = &*user {
        let user_id = user.id.clone();
        let mut conn = mysql_pool.get_conn().map_err(|err| {
            let error_message = format!("Failed to get connection: {}", err);
            println!("{}", error_message);
            error_message
        })?;

        let user_cards: Vec<String> = conn
            .exec(
                "SELECT uc.card_id FROM user_cards uc
                JOIN decks d ON uc.deck_id = d.id
                WHERE d.user_id = :user_id",
                params! {
                    "user_id" => &user_id,
                },
            )
            .map_err(|err| {
                let error_message = format!("Failed to execute query: {}", err);
                println!("{}", error_message);
                error_message
            })?;

        Ok(user_cards)
    } else {
        Err("No current user".into())
    }
}

#[tauri::command]
fn increment_clicked_times(
    game_card_id: String,
    answer: String,
    mysql_pool: State<Arc<Pool>>,
) -> Result<(), String> {
    let mut conn = mysql_pool
        .get_conn()
        .map_err(|e| format!("Failed to get connection: {:?}", e))?;

    let result_card = conn.exec_drop(
        "UPDATE game_card_choices
        SET clicked_times = clicked_times + 1
        WHERE game_card_id = :game_card_id AND answer = :answer",
        params! {
            "game_card_id" => game_card_id,
            "answer" => answer,
        },
    );

    match result_card {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to update: {:?}", e)),
    }
}

#[tauri::command]
fn update_player_stats(
    game_id: String,
    is_correct: bool,
    time_left: i16,
    current_user: State<Arc<CurrentUser>>,
    mysql_pool: State<Arc<Pool>>,
) -> Result<(), String> {
    let user = current_user.user.lock().unwrap();

    if let Some(user) = &*user {
        let user_id = user.id.clone();
        let score_gain = time_left * 100;

        let mut conn = mysql_pool.get_conn().map_err(|err| {
            let error_message = format!("Failed to get connection: {}", err);
            println!("{}", error_message);
            error_message
        })?;

        if is_correct {
            let result = conn.exec_drop(
                "UPDATE game_players
                SET correct_answers = correct_answers + 1, score = score + :score_gain
                WHERE game_id = :game_id AND user_id = :user_id",
                params! {
                    "score_gain" => score_gain,
                    "game_id" => game_id,
                    "user_id" => user_id,
                },
            );
            if result.is_err() {
                return Err(format!("Failed to update: {:?}", result.err()));
            }
        } else {
            let result = conn.exec_drop(
                "UPDATE game_players
                SET incorrect_answers = incorrect_answers + 1 
                WHERE game_id = :game_id AND user_id = :user_id",
                params! {
                    "game_id" => game_id,
                    "user_id" => user_id,
                },
            );
            if result.is_err() {
                return Err(format!("Failed to update: {:?}", result.err()));
            }
        }

        Ok(())
    } else {
        Err("No current user".into())
    }
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
            insert_user_card,
            get_deck_by_id,
            fail_learning_card,
            pass_new_card,
            pass_learning_card,
            pass_due_card,
            pass_relearning_card,
            fail_due_card,
            get_cards_for_game,
            get_games,
            register_game_player,
            get_user_card_ids,
            increment_clicked_times,
            update_player_stats
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
