import React from "react";
import { HashRouter, Route } from "react-router-dom";

import Login from "./Login";
import Registration from "./Registration";
import Reset from "./Reset";

export default function Welcome() {
    return (
        <React.Fragment>
            <h1>Welcome to Social Network</h1>
            <HashRouter>
                <React.Fragment>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={Reset} />
                </React.Fragment>
            </HashRouter>
        </React.Fragment>
    );
}
