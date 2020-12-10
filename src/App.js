import React, { useEffect } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getOwnProfile } from "./actions";

import axios from "./axios";

import Logo from "./Logo";
//import ProfilePic from "./ProfilePic";
import Profile from "./Profile";
import OtherProfile from "./OtherProfile";

import FindPeople from "./FindPeople";
import Friends from "./Friends";
import Chat from "./Chat";

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getOwnProfile());
    }, []);

    const profile = useSelector((state) => state.profile);

    function handleLogout() {
        axios.post("/logout").then(() => location.replace("/welcome#/login"));
    }

    if (!profile.user_id) return null;
    return (
        <React.Fragment>
            <BrowserRouter>
                <React.Fragment>
                    <header>
                        <Logo />

                        <Link to="/">
                            <div className="me">
                                <img src={profile.profile_picture}></img>
                            </div>
                        </Link>

                        {/* <ProfilePic
                                profile_picture={this.state.profile_picture}
                                toggleUploader={this.toggleUploader}
                            /> */}
                    </header>

                    <main>
                        <Route exact path="/" component={Profile} />
                        <Route
                            path="/profile/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route
                            path="/profiles"
                            render={(props) => (
                                <FindPeople
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/friendships" component={Friends} />
                        <Route path="/chat" component={Chat} />
                    </main>
                    <footer>
                        <Link to="/chat">Chat</Link>
                        <Link to="/profiles">Find People</Link>
                        <Link to="/friendships">My Friends</Link>
                        <Link to="/logout" onClick={handleLogout}>
                            Logout
                        </Link>
                    </footer>
                </React.Fragment>
            </BrowserRouter>
        </React.Fragment>
    );
}
