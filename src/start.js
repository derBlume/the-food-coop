import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./Welcome.js";

let component = null;

if (location.pathname === "/welcome") {
    component = <Welcome />;
} else {
    component = <h1>I will be the logo...</h1>;
}

ReactDOM.render(component, document.querySelector("main"));
