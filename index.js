const express = require("express");
const compression = require("compression");
const session = require("cookie-session");
const bcrypt = require("bcryptjs");
const csurf = require("csurf");

const db = require("./db.js");
const secrets = require("./secrets.json");

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.static("public"));

app.use(
    session({
        secret: secrets.sessionSecret,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    })
);

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (request, response) =>
        response.sendFile(`${__dirname}/bundle.js`)
    );
}

app.use(csurf());

app.use((request, response, next) => {
    response.cookie("csrf-token", request.csrfToken());
    next();
});

app.get("/welcome", (request, response) => {
    if (request.session.userId) {
        response.redirect("/");
    } else {
        response.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (request, response) => {
    bcrypt
        .hash(request.body.password, 10)
        .then((hashedPassword) => {
            request.body.password = hashedPassword;
            return db.addUser(request.body);
        })
        .then((data) => {
            request.session.userId = data.rows[0].id;
            response.sendStatus(200);
        });
});

app.post("/login", (request, response) => {
    let id;
    db.getUserByEmail(request.body.email)
        .then((data) => {
            if (data.rows.length === 1) {
                id = data.rows[0].id;

                return bcrypt.compare(
                    request.body.password,
                    data.rows[0].password
                );
            } else {
                throw new Error("Wrong Username!");
            }
        })
        .then((match) => {
            if (match) {
                request.session.userId = id;
                response.sendStatus(200);
            } else {
                throw new Error("Wrong Password!");
            }
        })
        .catch((error) => {
            response.status(400).json({ message: error.message });
            console.log(error.message);
        });
});

app.get("*", function (request, response) {
    if (!request.session.userId) {
        response.redirect("/welcome");
    } else {
        response.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
