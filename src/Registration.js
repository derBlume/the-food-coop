import React from "react";
import { Link } from "react-router-dom";

import axios from "./axios.js";

export default class Registration extends React.Component {
    constructor() {
        super();

        this.state = {
            first_name: "",
            last_name: "",
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
            .post("/api/register", this.state)
            .then(() => {
                location.replace("/");
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });

        console.log("FORM SUBMITTED", this.state);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="error">
                    {this.state.error && <p>Something went wrong.</p>}
                </div>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="first name"
                        onChange={this.handleChange}
                        value={this.state.first_name}
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="last name"
                        onChange={this.handleChange}
                        value={this.state.last_name}
                    />
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
                    <button type="submit">Create Account</button>
                </form>
                <Link to="/login">Login</Link>
            </React.Fragment>
        );
    }
}
