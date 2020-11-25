const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:patrick:postgres@localhost:5432/socialnetwork"
);

module.exports.addUser = function addUser({
    email,
    password,
    firstname,
    lastname,
}) {
    return db.query(
        "INSERT INTO users (email, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING id",
        [email, password, firstname, lastname]
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
