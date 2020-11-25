import React from "react";
import axios from "./axios.js";

export default class Registration extends React.Component {
    constructor() {
        super();

        this.state = {
            firstname: "Andi",
            lastname: "",
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
            .post("/register", this.state)
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
        console.log("handleChange", e.target.name, e.target.value);

        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    render() {
        return (
            <div>
                <h2>Register now</h2>
                {this.state.error && <p>DIDNT WORK, TOO BAD, BYE.</p>}
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="firstname"
                        placeholder="first name"
                        onChange={this.handleChange}
                        value={this.state.firstname}
                    />
                    <input
                        type="text"
                        name="lastname"
                        placeholder="last name"
                        onChange={this.handleChange}
                        value={this.state.lastname}
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
                        placeholder="pasword"
                        onChange={this.handleChange}
                        value={this.state.password}
                    />
                    <button type="submit">Create Account</button>
                </form>
            </div>
        );
    }
}
