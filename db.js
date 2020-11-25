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
