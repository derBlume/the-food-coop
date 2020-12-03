import React from "react";

import axios from "./axios.js";

import FriendBtn from "./FriendBtn.js";

export default class OtherProfile extends React.Component {
    constructor() {
        super();

        this.state = {
            first_name: "",
            last_name: "",
            bio: "",
            profile_picture: "",
            error: null,
        };
    }

    async componentDidMount() {
        console.log("OtherProfile mounted");

        try {
            const { data } = await axios.get(
                `/api/profile/${this.props.match.params.id}`
            );
            this.setState(data);
        } catch (e) {
            // tried to access own profile
            if (e.response.status === 404) {
                this.setState({
                    error: "The profile you requested does not exist.",
                });
            } else {
                console.log("Own profile");
                this.props.history.push("/");
            }
        }
    }

    render() {
        return (
            <div className="other-profile">
                {this.state.error && <p>{this.state.error}</p>}
                <h1>
                    {this.state.first_name} {this.state.last_name}
                </h1>
                <p>{this.state.bio}</p>
                <img src={this.state.profile_picture}></img>
                <FriendBtn id={this.props.match.params.id} />
            </div>
        );
    }
}
