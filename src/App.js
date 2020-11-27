import React from "react";

import axios from "./axios.js";

import Logo from "./Logo.js";
import ProfilePic from "./ProfilePic";
import Profile from "./Profile";
import Uploader from "./Uploader";

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            user_id: null,
            first_name: null,
            last_name: null,
            profile_picture: null,
            bio: null,

            uploaderVisible: false,
        };

        this.toggleUploader = this.toggleUploader.bind(this);
        this.updateProfilePicture = this.updateProfilePicture.bind(this);
        this.updateBio = this.updateBio.bind(this);
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

    updateBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    render() {
        if (!this.state.user_id) return null; //!!!!!
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
                <hr></hr>
                <Profile
                    profile_picture={this.state.profile_picture}
                    first_name={this.state.first_name}
                    last_name={this.state.last_name}
                    bio={this.state.bio}
                    toggleUploader={this.toggleUploader}
                    updateBio={this.updateBio}
                />

                {this.state.uploaderVisible && (
                    <Uploader
                        updateProfilePicture={this.updateProfilePicture}
                        toggleUploader={this.toggleUploader}
                    />
                )}
            </React.Fragment>
        );
    }
}
