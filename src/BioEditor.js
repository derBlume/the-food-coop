import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOwnProfile } from "./actions.js";

export default function BioEditor() {
    const dispatch = useDispatch();
    const bio = useSelector((state) => state.profile.bio);

    const [draft, setDraft] = useState(bio);
    const [editing, setEditing] = useState(false);

    function handleChange(event) {
        setDraft(event.target.value);
    }

    function toggleEditor() {
        setEditing(!editing);
    }

    function handleSubmit(event) {
        event.preventDefault();
        dispatch(updateOwnProfile("bio", draft));
        setEditing(!editing);
    }

    if (!editing) {
        if (bio) {
            return (
                <p>
                    {bio}{" "}
                    <span className="edit-link" onClick={toggleEditor}>
                        Edit
                    </span>
                </p>
            );
        } else {
            return (
                <p>
                    <span className="edit-link" onClick={toggleEditor}>
                        Add a bio now!
                    </span>
                </p>
            );
        }
    } else {
        return (
            <React.Fragment>
                <p>I am the editor</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="textarea"
                        name="bio"
                        value={draft}
                        onChange={handleChange}
                    />
                    <button type="submit">Submit</button>
                </form>
            </React.Fragment>
        );
    }
}
