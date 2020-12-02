DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL REFERENCES users(email),
    reset_code VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    bio VARCHAR,
    profile_picture VARCHAR
)

CREATE TABLE friendships(
   id SERIAL PRIMARY KEY,
   sender_id INTEGER REFERENCES profiles(id) NOT NULL,
   recipient_id INTEGER REFERENCES profiles(id) NOT NULL,
   accepted BOOLEAN DEFAULT false
 );