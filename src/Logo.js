import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <React.Fragment>
            <div className="logo">
                <Link to="/">
                    <img src="/logo.svg" alt="Logo" />
                </Link>
                <div>
                    FOOD<br></br>COOP
                </div>
            </div>
        </React.Fragment>
    );
}
