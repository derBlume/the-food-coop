import React, { useState, useEffect } from "react";

import axios from "./axios";

export default function FriendBtn(props) {
    const [buttonTxt, setButtonTxt] = useState("");
    console.log(props);

    useEffect(() => {
        axios
            .get(`/api/friendship/${props.id}`)
            .then(({ data }) => setButtonTxt(data));
    }, [props.id]);

    function handleClick() {
        let url;
        if (buttonTxt === "SEND FRIEND REQUEST") {
            url = `/api/request-friendship/${props.id}`;
        } else if (buttonTxt === "ACCEPT FRIEND REQUEST") {
            url = `/api/accept-friendship/${props.id}`;
        } else {
            url = `/api/cancel-friendship/${props.id}`;
        }

        console.log(url);
        axios.post(url).then(({ data }) => setButtonTxt(data));
    }

    return (
        <React.Fragment>
            <button onClick={handleClick}>{buttonTxt}</button>
        </React.Fragment>
    );
}
