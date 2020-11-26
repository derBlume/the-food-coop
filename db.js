const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:patrick:postgres@localhost:5432/socialnetwork"
);

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
                "INSERT INTO profiles (user_id, first_name, last_name) VALUES ($1, $2, $3) RETURNING user_id",
                [rows[0].id, first_name, last_name]
            )
        );
};

module.exports.getUserByEmail = function getUserByEmail(email) {
    return db.query("SELECT * FROM users WHERE email = $1", [email]);
};

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

module.exports.updatePassword = function updatePassword(password, email) {
    return db.query("UPDATE users SET password = $1 WHERE email = $2", [
        password,
        email,
    ]);
};

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
