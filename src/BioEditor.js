import React from "react";

import axios from "./axios.js";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);

        // if you need access to this.props in your constructor,
        // you have to pass it to the super function first.

        this.state = {
            bio: this.props.bio,
            editing: false,
            error: null,
        };
        this.toggleEditor = this.toggleEditor.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleEditor() {
        this.setState({
            editing: !this.state.editing,
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
        console.log(this.state.bio);
    }

    handleSubmit(e) {
        e.preventDefault();

        axios
            .post("/api/update-profile-bio", this.state)
            .then(() => {
                this.props.updateBio(this.state.bio);
                this.toggleEditor();
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });

        console.log("FORM SUBMITTED", this.state);
    }

    render() {
        if (!this.state.editing) {
            if (this.props.bio) {
                return (
                    <p>
                        {this.props.bio}{" "}
                        <span className="edit-link" onClick={this.toggleEditor}>
                            Edit
                        </span>
                    </p>
                );
            } else {
                return (
                    <p>
                        <span className="edit-link" onClick={this.toggleEditor}>
                            Add a bio now!
                        </span>
                    </p>
                );
            }
        } else {
            return (
                <React.Fragment>
                    <p>I am the editor</p>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="textarea"
                            name="bio"
                            value={this.state.bio}
                            onChange={this.handleChange}
                        />
                        <button type="submit">Submit</button>
                    </form>
                    {this.state.error && <p>Something Went wrong, sorry.</p>}
                </React.Fragment>
            );
        }
    }
}
