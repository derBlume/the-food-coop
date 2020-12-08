const express = require("express");
const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server);

const compression = require("compression");
const session = require("cookie-session");
const bcrypt = require("bcryptjs");
const csurf = require("csurf");
const crypto = require("crypto-random-string");
const sendEmail = require("./ses");

//const s3 = require("./middlewares/s3.js");
const s0 = require("./middlewares/s0.js");

const uploader = require("./middlewares/uploader.js");
const db = require("./db.js");
const secrets = require("./secrets.json");

app.use(compression());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const sessionMiddleware = session({
    secret: secrets.sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
});

app.use(sessionMiddleware);

io.use(function (socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

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

app.get("/api/own-profile", (request, response) => {
    db.getProfileByUserId(request.session.user_id)
        .then(({ rows }) => response.json(rows[0]))
        .catch((error) => {
            console.log(error);
            response.sendStatus(500);
        });
});

app.get("/api/profile/:id", (request, response) => {
    if (!request.session.user_id) {
        return response.sendStatus(401);
    } else if (request.params.id == request.session.user_id) {
        return response.sendStatus(403);
    } else {
        console.log(request.params.id);
        db.getProfileByUserId(request.params.id)
            .then(({ rows }) => {
                if (rows.length === 1) {
                    return response.json(rows[0]);
                } else {
                    return response.sendStatus(404);
                }
            })
            .catch((error) => {
                console.log(error);
                response.sendStatus(500);
            });
    }
});

app.get("/api/profiles/", (request, response) => {
    db.getProfilesByQuery(request.query.query).then(({ rows }) => {
        response.json(rows);
    });
});

app.get("/api/friendship/:other_id", async (request, response) => {
    const own_id = request.session.profile_id;
    const other_id = request.params.other_id;
    try {
        const { rows } = await db.getFriendship({ own_id, other_id });

        if (rows.length === 1 && rows[0].accepted === true) {
            console.log("friendship established");
            response.json("UNFRIEND");
        } else if (rows.length === 1 && rows[0].accepted === false) {
            if (rows[0].sender_id === own_id) {
                console.log("pending, waiting for other party to accept");
                response.json("CANCEL FRIEND REQUEST");
            } else {
                console.log("pending, do you want to accept?");
                response.json("ACCEPT FRIEND REQUEST");
            }
        } else {
            console.log("no friendship");
            response.json("SEND FRIEND REQUEST");
        }
    } catch (error) {
        console.log(error);
    }
});

app.get("/api/friendships", async (request, response) => {
    const { rows } = await db.getFriendships(request.session.profile_id);
    console.log(rows);
    response.json(rows);
});

app.post("/api/request-friendship/:other_id", async (request, response) => {
    const own_id = request.session.profile_id;
    const other_id = request.params.other_id;
    await db.requestFriendship({ own_id, other_id });
    console.log("Friendship requested");
    response.json("CANCEL FRIEND REQUEST");
});

app.post("/api/accept-friendship/:other_id", async (request, response) => {
    const own_id = request.session.profile_id;
    const other_id = request.params.other_id;
    await db.acceptFriendship({ own_id, other_id });
    console.log("Friendship accepted");
    response.json("UNFRIEND");
});

app.post("/api/cancel-friendship/:other_id", async (request, response) => {
    const own_id = request.session.profile_id;
    const other_id = request.params.other_id;
    await db.cancelFriendship({ own_id, other_id });
    console.log("Friendship cancelled");
    response.json("SEND FRIEND REQUEST");
});

app.post(
    "/api/upload-image",
    uploader.single("file"),
    s0,
    async (request, response) => {
        try {
            const data = await db.updateProfilePicture({
                ...request.body,
                ...request.session,
            });
            //TODO: delete old file!!!
            response.json(data.rows[0]);
        } catch (error) {
            console.log(error);
            response.sendStatus(500);
        }
    }
);

app.post("/api/update-profile-bio", (request, response) => {
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

app.post("/api/register", (request, response) => {
    bcrypt
        .hash(request.body.password, 10)
        .then((password) => db.addUser({ ...request.body, password }))
        .then(({ rows }) => {
            request.session.user_id = rows[0].user_id;
            request.session.profile_id = rows[0].profile_id;
            response.sendStatus(200);
        })
        .catch((error) => {
            console.log(error);
            response.sendStatus(500);
        });
});

app.post("/api/login", (request, response) => {
    let user_id;
    let profile_id;
    db.getUserByEmail(request.body.email)
        .then(({ rows }) => {
            if (rows.length === 1) {
                user_id = rows[0].user_id;
                profile_id = rows[0].profile_id;

                return bcrypt.compare(request.body.password, rows[0].password);
            } else {
                throw new Error("Wrong Username!");
            }
        })
        .then((match) => {
            if (match) {
                request.session.user_id = user_id;
                request.session.profile_id = profile_id;
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

app.post("/api/reset/start", (request, response) => {
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

app.post("/api/reset/verify", (request, response) => {
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

server.listen(8080, function () {
    console.log("I'm listening.");
});

io.on("connection", async (socket) => {
    console.log("user connected", socket.id);

    const user_id = socket.request.session.user_id;
    if (!user_id) {
        return socket.disconnect(true);
    }

    const { rows } = await db.getChatMessages(10);

    socket.emit("chatMessages", rows);

    socket.on("sendChatMessage", async (chatMessage) => {
        console.log(chatMessage);
        const chat_message = {
            message: chatMessage,
            profile_id: socket.request.session.profile_id,
        };
        console.log("const chat_message: ", chat_message);
        const { rows } = await db.addChatMessage(chat_message);
        console.log("returned from db: ", rows);
        io.emit("chatMessage", rows);
    });
});
