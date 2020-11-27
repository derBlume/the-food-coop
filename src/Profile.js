import React from "react";

import BioEditor from "./BioEditor.js";
import ProfilePic from "./ProfilePic";

export default class Profile extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    render() {
        return (
            <div className="profile">
                <h1>
                    {this.props.first_name} {this.props.last_name}
                </h1>
                <BioEditor
                    bio={this.props.bio}
                    updateBio={this.props.updateBio}
                />
                <ProfilePic
                    profile_picture={this.props.profile_picture}
                    toggleUploader={this.props.toggleUploader}
                />
            </div>
        );
    }
}
