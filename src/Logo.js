import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <div className="logo">
            <div className="logo-text">
                <Link to="/">
                    <span className="the">THE</span>
                    <br></br>F<span className="oo">🍏🍅</span>D<br></br>C
                    <span className="oo">🍑🧅</span>P{/* 🍏🍎🍑🍅🧅🥗🥝🥬🍓 */}
                </Link>
            </div>
            {/* <img src="/logo.svg" alt="Logo" /> */}
        </div>
    );
}
