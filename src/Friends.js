import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { acceptFriendship, cancelFriendship, getFriendships } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFriendships());
    }, []);

    const friends = useSelector(
        (state) =>
            state.friendships &&
            state.friendships.filter((friendship) => friendship.accepted)
    );

    const wannabeFriends = useSelector(
        (state) =>
            state.friendships &&
            state.friendships.filter(
                (friendship) => friendship.accepted === false
            )
    );

    if (!friends) {
        return null;
    }

    if (!wannabeFriends) {
        return null;
    }

    return (
        <React.Fragment>
            {!wannabeFriends.length && <p>No pending friend requests.</p>}
            {!!wannabeFriends.length && (
                <p>People who want to be friends with you:</p>
            )}
            <ul>
                {!!wannabeFriends.length &&
                    wannabeFriends.map((profile) => (
                        <li key={profile.id}>
                            <strong>
                                <Link to={"/profile/" + profile.id}>
                                    {profile.first_name} {profile.last_name}
                                </Link>
                            </strong>
                            <button
                                onClick={() =>
                                    dispatch(acceptFriendship(profile.id))
                                }
                            >
                                accept
                            </button>
                        </li>
                    ))}
            </ul>
            {!friends.length && (
                <p>
                    You have no friends.{" "}
                    <Link to="/profiles">Find some now!</Link>{" "}
                </p>
            )}
            {!!friends.length && <p>Your friends:</p>}
            <ul>
                {!!friends.length &&
                    friends.map((profile) => (
                        <li key={profile.id}>
                            <strong>
                                <Link to={"/profile/" + profile.id}>
                                    {profile.first_name} {profile.last_name}
                                </Link>
                            </strong>
                            <button
                                onClick={() =>
                                    dispatch(cancelFriendship(profile.id))
                                }
                            >
                                unfriend
                            </button>
                        </li>
                    ))}
            </ul>
        </React.Fragment>
    );
}
