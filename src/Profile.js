import React from "react";
import { useSelector } from "react-redux";

import BioEditor from "./BioEditor.js";
import ProfilePic from "./ProfilePic";

export default function Profile() {
    const profile = useSelector((store) => store.profile);

    return (
        <div className="profile">
            <h1>
                {profile.first_name} {profile.last_name}
            </h1>
            <div className="profilePic">
                <ProfilePic />
            </div>
            <div className="bio">
                <BioEditor />
            </div>
        </div>
    );
}
