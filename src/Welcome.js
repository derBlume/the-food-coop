import React from "react";
import { HashRouter, Route } from "react-router-dom";

import Login from "./Login";
import Registration from "./Registration";
import Reset from "./Reset";
import Logo from "./Logo";

export default function Welcome() {
    return (
        <div className="welcome">
            <HashRouter>
                <Logo />
                <p>Grow with us! </p>
                <React.Fragment>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={Reset} />
                </React.Fragment>
                <img src="/logo.svg" />
            </HashRouter>
        </div>
    );
}
