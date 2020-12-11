import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOwnProfile } from "./actions.js";
import { Link } from "react-router-dom";

export default function BioEditor() {
    const dispatch = useDispatch();
    const bio = useSelector((state) => state.profile.bio);

    const [draft, setDraft] = useState(bio);
    const [editing, setEditing] = useState(false);

    function handleChange(event) {
        setDraft(event.target.value);
    }

    function toggleEditor(e) {
        e.preventDefault();
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
                    <Link to="" onClick={toggleEditor}>
                        edit
                    </Link>
                </p>
            );
        } else {
            return (
                <p>
                    <Link to="" onClick={toggleEditor}>
                        Add a bio now!
                    </Link>
                </p>
            );
        }
    } else {
        return (
            <React.Fragment>
                <form onSubmit={handleSubmit}>
                    <textarea
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
