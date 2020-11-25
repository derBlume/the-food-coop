import React from "react";
import { Link } from "react-router-dom";

import axios from "./axios.js";

export default class Login extends React.Component {
    constructor() {
        super();

        this.state = {
            email: "",
            password: "",
            error: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        axios
            .post("/login", this.state)
            .then(() => {
                location.replace("/");
            })
            .catch((error) => {
                console.log(error.response.data);
                this.setState({
                    error: error.response.data.message,
                });
            });

        console.log("FORM SUBMITTED", this.state);
    }

    handleChange(e) {
        console.log("handleChange", e.target.name, e.target.value);

        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    render() {
        return (
            <React.Fragment>
                <h2>Login</h2>
                {this.state.error && <p>Wrong username or password.</p>}
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="email"
                        onChange={this.handleChange}
                        value={this.state.email}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        onChange={this.handleChange}
                        value={this.state.password}
                    />
                    <button type="submit">Login</button>
                </form>
                <Link to="/">Registration</Link>
            </React.Fragment>
        );
    }
}
