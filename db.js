const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:patrick:postgres@localhost:5432/socialnetwork"
);

//USERS TABLE ------------------------
module.exports.addUser = function addUser({
    email,
    password,
    first_name,
    last_name,
}) {
    return db
        .query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
            [email, password]
        )
        .then(({ rows }) =>
            db.query(
                "INSERT INTO profiles (user_id, first_name, last_name) VALUES ($1, $2, $3) RETURNING user_id, id AS profile_id",
                [rows[0].id, first_name, last_name]
            )
        );
};

module.exports.getUserByEmail = function getUserByEmail(email) {
    return db.query(
        "SELECT users.id AS user_id, users.password AS password, profiles.id AS profile_id FROM users JOIN profiles ON users.id = profiles.user_id WHERE email = $1",
        [email]
    );
};

module.exports.updatePassword = function updatePassword(password, email) {
    return db.query("UPDATE users SET password = $1 WHERE email = $2", [
        password,
        email,
    ]);
};

//RESET_CODES TABLE --------------------
module.exports.addResetCode = function addResetCode(reset_code, email) {
    return db.query(
        "INSERT INTO reset_codes (reset_code, email) VALUES ($1, $2)",
        [reset_code, email]
    );
};

module.exports.verifyResetCode = function verifyCode(reset_code, email) {
    return db.query(
        "SELECT * FROM reset_codes WHERE reset_code = $1 AND email = $2",
        [reset_code, email]
    );
};

//PROFILES TABLE ------------------------
module.exports.getProfileByUserId = function getProfileByUserId(user_id) {
    return db.query("SELECT * FROM profiles WHERE user_id = $1", [user_id]);
};

module.exports.updateProfilePicture = function updateProfilePicture({
    url,
    user_id,
}) {
    return db.query(
        "UPDATE profiles SET profile_picture = $1 WHERE user_id = $2 RETURNING profile_picture",
        [url, user_id]
    );
};

module.exports.updateProfileBio = function updateProfileBio({ bio, user_id }) {
    return db.query(
        "UPDATE profiles SET bio = $1 WHERE user_id = $2 RETURNING bio",
        [bio, user_id]
    );
};

module.exports.getProfilesByQuery = function getProfilesByQuery(query) {
    return db.query(
        "SELECT * FROM profiles WHERE first_name ILIKE $1 OR last_name ILIKE $1 ORDER BY created_at DESC",
        [query + "%"]
    );
};

//FRIENDSHIPS TABLE: ---------------------------
module.exports.getFriendship = function getFriendship({ own_id, other_id }) {
    return db.query(
        "SELECT * FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1);",
        [own_id, other_id]
    );
};

module.exports.getFriendships = function getFriendships(own_id) {
    return db.query(
        `SELECT * FROM friendships 
        JOIN profiles 
          ON (sender_id=profiles.id 
              AND recipient_id=$1
              AND accepted=false) 
            OR (sender_id=profiles.id 
                AND recipient_id=$1      
                AND accepted=true)  
            OR (sender_id=$1      
                AND recipient_id=profiles.id 
                AND accepted=true);`,
        [own_id]
    );
};

module.exports.requestFriendship = function requestFriendship({
    own_id,
    other_id,
}) {
    return db.query(
        "INSERT INTO friendships (sender_id, recipient_id) VALUES ($1, $2)",
        [own_id, other_id]
    );
};

module.exports.acceptFriendship = function acceptFriendship({
    own_id,
    other_id,
}) {
    return db.query(
        "UPDATE friendships SET accepted = true WHERE recipient_id = $1 AND sender_id = $2",
        [own_id, other_id]
    );
};

module.exports.cancelFriendship = function cancelFriendship({
    own_id,
    other_id,
}) {
    return db.query(
        "DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1);",
        [own_id, other_id]
    );
};

// CHAT_MESSAGES TABLE: ------------------------------
module.exports.getChatMessages = function getChatMessages(limit) {
    return db.query(
        `SELECT 
            chat_messages.id AS id,
            chat_messages.created_at AS created_at,
            chat_messages.message AS message,
            profiles.first_name AS first_name,
            profiles.last_name AS last_name
        FROM chat_messages JOIN profiles ON chat_messages.profile_id = profiles.id
        ORDER BY chat_messages.created_at DESC
        LIMIT $1;`,
        [limit]
    );
};

module.exports.addChatMessage = function addChatMessage({
    message,
    profile_id,
}) {
    return db.query(
        `INSERT INTO chat_messages (message, profile_id) VALUES ($1, $2)
            RETURNING chat_messages.id AS id, 
                created_at,
                message, 
                (SELECT first_name FROM profiles WHERE id=$2 LIMIT 1),
                (SELECT last_name FROM profiles WHERE id=$2 LIMIT 1)`,
        [message, profile_id]
    );
};
