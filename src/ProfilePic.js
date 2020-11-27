import React from "react";

export default function ProfilePic(props) {
    const img = props.profile_picture
        ? props.profile_picture
        : "/defaultProfilePic.svg";
    // TODO: use props.profilePic to render actual profile picture,
    // also you want to have a default image, if user has not set a profile pic yet.
    return (
        <img
            onClick={props.toggleUploader}
            src={img}
            alt="Profile Picture"
        ></img>
    );
}
