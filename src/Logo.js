import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <div className="logo">
            <div className="logo-text">
                <Link to="/">
                    <span className="the">THE</span>
                    <br></br>FOOD<br></br>COOP
                </Link>
            </div>
            {/* <img src="/logo.svg" alt="Logo" /> */}
        </div>
    );
}
