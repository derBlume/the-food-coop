const sendEmail = require("./ses");

sendEmail(
    "info@patrickblume.de",
    "Hey Paddy",
    "this mail is sent through aws. "
)
    .then((res) => console.log("success", res))
    .catch((e) => console.log("error", e));
