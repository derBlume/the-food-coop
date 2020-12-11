import React, { useState } from "react";
import { useSelector } from "react-redux";

import Uploader from "./Uploader";

export default function ProfilePic() {
    const profile_picture = useSelector(
        (store) => store.profile.profile_picture
    );
    const [uploaderVisible, setUploaderVisible] = useState(false);

    const img = profile_picture ? profile_picture : "/defaultProfilePic.svg";

    function toggleUploader() {
        setUploaderVisible(!uploaderVisible);
    }

    return (
        <React.Fragment>
            <img onClick={toggleUploader} src={img} alt="Profile Picture"></img>
            {uploaderVisible && <Uploader toggleUploader={toggleUploader} />}
        </React.Fragment>
    );
}
