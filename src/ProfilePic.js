import React from "react";

export default function ProfilePic(props) {
    // TODO: use props.profilePic to render actual profile picture,
    // also you want to have a default image, if user has not set a profile pic yet.
    return (
        <img
            onClick={props.toggleUploader}
            src="/defaultProfilePic.svg"
            alt="Profile Pic Placeholder"
        ></img>
    );
}
