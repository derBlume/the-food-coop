module.exports = (request, response, next) => {
    if (!request.file) {
        return response.status(400).send();
    }

    request.body.url = "/uploads/" + request.file.filename;

    next();
};
