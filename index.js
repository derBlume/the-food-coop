const express = require("express");
const compression = require("compression");
const session = require("cookie-session");
const bcrypt = require("bcryptjs");
const csurf = require("csurf");
const crypto = require("crypto-random-string");
const sendEmail = require("./ses");

const s3 = require("./middlewares/s3.js");
const uploader = require("./middlewares/uploader.js");
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
    if (request.session.user_id) {
        response.redirect("/");
    } else {
        response.sendFile(__dirname + "/index.html");
    }
});

app.get("/profile", (request, response) => {
    db.getProfileByUserId(request.session.user_id)
        .then(({ rows }) => response.json(rows[0]))
        .catch((error) => {
            console.log(error);
            response.sendStatus(500);
        });
});

app.post("/upload-image", uploader.single("file"), s3, (request, response) => {
    db.updateProfilePicture({ ...request.body, ...request.session })
        .then((data) => {
            response.json(data.rows[0]);
        })
        .catch((error) => {
            console.log(error);
            response.sendStatus(500);
        });
});

app.post("/update-profile-bio", (request, response) => {
    console.log("POST request to /update-profile", {
        ...request.body,
        ...request.session,
    });
    db.updateProfileBio({ ...request.body, ...request.session })
        .then(({ rows }) => response.json(rows[0]))
        .catch((error) => {
            console.log(error);
            response.sendStatus(500);
        });
});

app.post("/register", (request, response) => {
    bcrypt
        .hash(request.body.password, 10)
        .then((password) => db.addUser({ ...request.body, password }))
        .then(({ rows }) => {
            request.session.user_id = rows[0].user_id;
            response.sendStatus(200);
        })
        .catch((error) => {
            console.log(error);
            response.sendStatus(500);
        });
});

app.post("/login", (request, response) => {
    let id;
    db.getUserByEmail(request.body.email)
        .then(({ rows }) => {
            if (rows.length === 1) {
                id = rows[0].id;

                return bcrypt.compare(request.body.password, rows[0].password);
            } else {
                throw new Error("Wrong Username!");
            }
        })
        .then((match) => {
            if (match) {
                request.session.user_id = id;
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

app.post("/reset/start", (request, response) => {
    const { email } = request.body;
    db.getUserByEmail(email).then(({ rows }) => {
        if (rows.length === 1) {
            crypto
                .async({ length: 10, type: "url-safe" })
                .then((reset_code) =>
                    Promise.all([
                        sendEmail(
                            email,
                            "Reset your Password",
                            "Here is your secret code: " + reset_code
                        ),
                        db.addResetCode(reset_code, email),
                    ])
                )
                .then(() => {
                    response.sendStatus(200);
                    console.log("SUCCESS SENDING MAIL & Saving reset code");
                })
                .catch((e) =>
                    console.log("ERROR SENDING MAIL or Saving reset code", e)
                );
        } else {
            console.log("user not found");
            response.status(400).json({ message: "User not found" });
        }
    });
});

app.post("/reset/verify", (request, response) => {
    const { reset_code, password, email } = request.body;
    console.log(reset_code, password, email);
    db.verifyResetCode(reset_code, email)
        .then(({ rows }) => {
            if (rows.length === 1) {
                console.log("User found", rows[0]);
                bcrypt
                    .hash(password, 10)
                    .then((password) => db.updatePassword(password, email))
                    .then(() => response.sendStatus(200));
            } else {
                console.log("Email/Code not found");
                response.status(400).json({ message: "Code not found" });
            }
        })
        .catch((error) => {
            console.log(error);
            response.status(500);
        });
});

app.get("*", function (request, response) {
    if (!request.session.user_id) {
        response.redirect("/welcome");
    } else {
        response.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
