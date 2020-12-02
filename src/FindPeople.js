import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "./axios";

export default function FindPeople() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (query === "") return;
        let stale = false;

        axios.get(`/api/profiles/?query=${query}`).then(({ data }) => {
            if (!stale) {
                setResults(data);
                console.log(data);
                console.log(results);
            }
        });

        //cleanup
        return () => {
            stale = true;
        };
    }, [query]);
    return (
        <React.Fragment>
            <input
                type="text"
                name="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {
                <ul>
                    {results.map((profile) => (
                        <li key={profile.id}>
                            <strong>
                                <Link to={"/profile/" + profile.id}>
                                    {profile.first_name} {profile.last_name}
                                </Link>
                            </strong>{" "}
                            {profile.bio}
                        </li>
                    ))}
                </ul>
            }
        </React.Fragment>
    );
}
