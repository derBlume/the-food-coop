import React from "react";

import axios from "./axios.js";

import Logo from "./Logo.js";
import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            user_id: null,
            first_name: null,
            last_name: null,
            profile_picture: null,

            uploaderVisible: false,
        };

        this.toggleUploader = this.toggleUploader.bind(this);
    }

    componentDidMount() {
        axios
            .get("/profile")
            .then(({ data }) => {
                this.setState(data);
                console.log(this.state);
            })
            .catch((error) => console.log(error));
    }

    toggleUploader() {
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    updateProfilePicture(newProfilePicture) {
        this.setState({
            profile_picture: newProfilePicture,
        });
    }

    render() {
        return (
            <React.Fragment>
                <header>
                    {/* <div className="logo"> */}
                    <Logo />
                    {/* </div> */}
                    <ProfilePic
                        profile_picture={this.state.profile_picture}
                        toggleUploader={this.toggleUploader}
                    />
                </header>
                {this.state.first_name} {this.state.last_name} <br></br>
                user_id: {this.state.user_id} <br></br>
                profile_picture: {this.state.profile_picture}
                {this.state.uploaderVisible && (
                    <Uploader
                        updateProfilePicture={this.updateProfilePicture}
                    />
                )}
            </React.Fragment>
        );
    }
}
