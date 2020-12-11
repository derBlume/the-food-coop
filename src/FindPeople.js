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
        <div className="find-people">
            <input
                type="text"
                name="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {
                <div className="results">
                    {results.map((profile) => (
                        <div className="result" key={profile.id}>
                            <div className="me">
                                <img src={profile.profile_picture} />
                            </div>
                            <div className="name">
                                <Link to={"/profile/" + profile.id}>
                                    {profile.first_name} {profile.last_name}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}
