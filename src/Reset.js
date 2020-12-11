import React from "react";

import axios from "./axios.js";

export default class ResetPassword extends React.Component {
    constructor() {
        super();

        this.state = {
            step: 1,
            email: "",
            reset_code: "",
            password: "",
            error: false,
        };

        this.handleSubmitStart = this.handleSubmitStart.bind(this);
        this.handleSubmitVerify = this.handleSubmitVerify.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmitStart(e) {
        e.preventDefault();

        axios
            .post("/api/reset/start", this.state)
            .then(() => {
                this.setState({ step: 2 });
            })
            .catch((error) => {
                this.setState({
                    error: error.response.data.message,
                });
            });

        console.log("FORM SUBMITTED", this.state);
    }

    handleSubmitVerify(e) {
        e.preventDefault();

        axios
            .post("/api/reset/verify", this.state)
            .then(() => {
                this.setState({ step: 3 });
            })
            .catch((error) => {
                this.setState({
                    error: error.response.data.message,
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
        if (this.state.step === 1) {
            return (
                <React.Fragment>
                    <p>Please enter the email you signed up with:</p>
                    {this.state.error}
                    <form onSubmit={this.handleSubmitStart}>
                        <input
                            type="email"
                            name="email"
                            placeholder="email"
                            onChange={this.handleChange}
                            value={this.state.email}
                        />

                        <button type="submit">Reset password</button>
                    </form>
                </React.Fragment>
            );
        } else if (this.state.step === 2) {
            return (
                <React.Fragment>
                    <h1>
                        Give us your Auth Code that weve sent to your email and
                        also your new password, but probably you are going to
                        forget it again.
                    </h1>
                    {this.state.error}
                    <form onSubmit={this.handleSubmitVerify}>
                        <input
                            type="text"
                            name="reset_code"
                            placeholder="Reset Code"
                            onChange={this.handleChange}
                            value={this.state.reset_code}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            onChange={this.handleChange}
                            value={this.state.password}
                        />

                        <button type="submit">Submit</button>
                    </form>
                </React.Fragment>
            );
        } else {
            return <h1>Successful, go to Login.</h1>;
        }
    }
}
