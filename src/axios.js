import axios from "axios";

const instance = axios.create({
    xsrfHeaderName: "csrf-token",
    xsrfCookieName: "csrf-token",
});

export default instance;
