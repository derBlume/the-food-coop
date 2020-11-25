const aws = require("aws-sdk");

let secrets;

if (process.env.NODE_ENV === "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets.json");
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-central-1",
});

module.exports = function (recipient, subject, message) {
    return ses
        .sendEmail({
            Source: "Socialice <info@patrickblume.de>",
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Subject: {
                    Data: subject,
                },
                Body: {
                    Text: {
                        Data: message,
                    },
                },
            },
        })
        .promise();
};
