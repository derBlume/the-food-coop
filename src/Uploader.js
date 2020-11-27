import React from "react";

import axios from "./axios.js";

export default class Uploader extends React.Component {
    constructor() {
        super();

        this.state = {
            image: null,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0],
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("submitting");

        const formData = new FormData();

        formData.append("file", this.state.image);

        axios
            .post("/upload-image", formData)
            .then((response) => {
                console.log("upload succesful", response.data);
                this.props.updateProfilePicture(response.data.profile_picture);
            })
            .catch(() => {
                console.log("upload failed");
            });
    }

    render() {
        return (
            <div className="modal">
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={this.handleChange}
                    />
                    <button type="submit">Upload</button>
                </form>
            </div>
        );
    }
}
