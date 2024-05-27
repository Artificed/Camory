CREATE DATABASE camory;

USE camory;

CREATE TABLE users (
    id CHAR(36) PRIMARY KEY NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
);

INSERT INTO users(id, email, password, username)
VALUES
('a77ab6ae-aa1e-4261-a12d-5bcc69a0d04f', 'dummy@gmail.com', 'dummy', 'dummy');

CREATE TABLE decks (
    id CHAR(36) PRIMARY KEY NOT NULL,
    user_id CHAR(36),
    name VARCHAR(255) NOT NULL,
    new_cards_per_day INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO decks (id, user_id, name, new_cards_per_day)
VALUES
('018f8c8e-88df-7651-82e0-eae84b90def6', 'a77ab6ae-aa1e-4261-a12d-5bcc69a0d04f', 'english', 20),
('018f8c8f-93c6-79fb-beae-d35f88920a64', 'a77ab6ae-aa1e-4261-a12d-5bcc69a0d04f', 'japanese', 20);

CREATE TABLE cards (
    id CHAR(36) PRIMARY KEY NOT NULL,
    deck_id CHAR(36) NOT NULL,
    status VARCHAR(255) NOT NULL,
    ease DOUBLE NOT NULL,
    `interval` INT NOT NULL,
    fails INT NOT NULL,
    due DATE,
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO cards(id, deck_id, `status`, ease, `interval`, fails)
VALUES
('ec64de29-01c7-43f4-b6b6-e661243e0bd9', '018f8c8e-88df-7651-82e0-eae84b90def6', 'new', 2.5, 0, 0),
('922a8553-5e72-4013-b319-87c1d52b065e', '018f8c8e-88df-7651-82e0-eae84b90def6', 'new', 2.5, 0, 0),
('c4c828d7-f59b-48ae-8bd9-3580de0b4914', '018f8c8e-88df-7651-82e0-eae84b90def6', 'new', 2.5, 0, 0),
('cea43fd4-ace0-458a-b08e-7db46848b0f9', '018f8c8e-88df-7651-82e0-eae84b90def6', 'new', 2.5, 0, 0);

CREATE TABLE card_contents(
	card_id CHAR(36) NOT NULL,
    vocabulary VARCHAR(255) NOT NULL,
    clue VARCHAR(255),
    asset VARCHAR(255),
    definition VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (card_id)
);

INSERT INTO card_contents(card_id, vocabulary, clue, asset, definition, description)
VALUES
('ec64de29-01c7-43f4-b6b6-e661243e0bd9', 'Turtle', 'noun', '', 'Definition: A reptile that lives in the sea and has a thick shell covering its body into which it can move its head and legs for protection.', 'Synonyms: tortoise'),
('922a8553-5e72-4013-b319-87c1d52b065e', 'Butterfly', 'noun', '', 'Definition: An insect with large, colorful wings.', 'Similar: moth'),
('c4c828d7-f59b-48ae-8bd9-3580de0b4914', 'Elephant', 'noun', '', 'Definition: A large, gray mammal with a long trunk and tusks.', 'None'),
('cea43fd4-ace0-458a-b08e-7db46848b0f9', 'Cat', 'noun', '', 'Definition: A small domesticated mammal with soft fur.', 'None');