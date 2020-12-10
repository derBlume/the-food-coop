import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfilePicture } from "./actions.js";

export default function Uploader(props) {
    const [file, setFile] = useState(null);

    const dispatch = useDispatch();

    function handleChange(e) {
        setFile(e.target.files[0]);
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log("submitting");

        const formData = new FormData();

        formData.append("file", file);
        dispatch(updateProfilePicture(formData));
    }

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                />
                <button type="submit">Upload</button>
            </form>
            <p onClick={props.toggleUploader}>close</p>
        </div>
    );
}
