import React from "react";
import { useSelector } from "react-redux";

import BioEditor from "./BioEditor.js";
import ProfilePic from "./ProfilePic";

export default function Profile() {
    const profile = useSelector((store) => store.profile);

    return (
        <React.Fragment>
            <div className="profile">
                <h1>
                    {profile.first_name} {profile.last_name}
                </h1>
                <ProfilePic />
                <BioEditor />
            </div>
        </React.Fragment>
    );
}
