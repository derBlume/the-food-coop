import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

import axios from "./axios";

import Logo from "./Logo";
//import ProfilePic from "./ProfilePic";
import Profile from "./Profile";
import OtherProfile from "./OtherProfile";
import Uploader from "./Uploader";
import FindPeople from "./FindPeople";
import Friends from "./Friends";
import Chat from "./Chat";

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            user_id: null,
            first_name: null,
            last_name: null,
            profile_picture: null,
            bio: null,

            uploaderVisible: false,
        };

        this.toggleUploader = this.toggleUploader.bind(this);
        this.updateProfilePicture = this.updateProfilePicture.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        axios
            .get("/api/own-profile")
            .then(({ data }) => {
                this.setState(data);
            })
            .catch((error) => console.log(error));
    }

    toggleUploader() {
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    updateProfilePicture(newProfilePicture) {
        this.setState({
            profile_picture: newProfilePicture,
        });
    }

    updateBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    render() {
        if (!this.state.user_id) return null;
        return (
            <React.Fragment>
                <BrowserRouter>
                    <React.Fragment>
                        <header>
                            <Logo />

                            <Link to="/">
                                <div className="me">
                                    <img src={this.state.profile_picture}></img>
                                </div>
                            </Link>

                            {/* <ProfilePic
                                profile_picture={this.state.profile_picture}
                                toggleUploader={this.toggleUploader}
                            /> */}
                        </header>

                        <main>
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <Profile
                                        profile_picture={
                                            this.state.profile_picture
                                        }
                                        first_name={this.state.first_name}
                                        last_name={this.state.last_name}
                                        bio={this.state.bio}
                                        toggleUploader={this.toggleUploader}
                                        updateBio={this.updateBio}
                                    />
                                )}
                            />
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
                        </footer>
                    </React.Fragment>
                </BrowserRouter>

                {this.state.uploaderVisible && (
                    <Uploader
                        updateProfilePicture={this.updateProfilePicture}
                        toggleUploader={this.toggleUploader}
                    />
                )}
            </React.Fragment>
        );
    }
}
