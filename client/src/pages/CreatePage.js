import "../styles/CreatePageStyle.css";

import TypeSelection from "../components/createPageComponents/TypeSelection";
import GenreSelection from "../components/createPageComponents/GenreSelection";
import LoadingScreen from "../components/createPageComponents/LoadingScreen";
import IMDBSelection from "../components/createPageComponents/IMDBSelection";
import ReleaseYearSelection from "../components/createPageComponents/ReleaseYearSelection";
import MovieCountSelection from "../components/createPageComponents/MovieCountSelection";
import SessionNameSelection from "../components/createPageComponents/SessionNameSelection";

import React from "react";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../App";

export default function CreatePage() {
    const [selectedTypes, setSelectedTypes] = useState(["Tv Shows", "Movie"]);
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [isFetchDone, setIsFetchDone] = useState(false);
    const [status, setStatus] = useState("create");
    const [hasActiveSession, setHasActiveSession] = useState(false);

    useEffect(() => {
        document.title = "Create Session - Movie Night";

        fetch(API_BASE_URL + "/genres", {
            method: "GET",
            headers: new Headers({ "ngrok-skip-browser-warning": "69420" }),
        })
            .then((response) => {
                console.log(response.headers);
                return response.json();
            })
            .then((data) => {
                setGenres(data["genres"]);
                setSelectedGenres(data["genres"]);
                setIsFetchDone(true);
            })
            .catch((error) => {
                console.log("Error: ", error);
            });

        if (
            !localStorage.getItem("userCode") &&
            !localStorage.getItem("creationTime")
        ) {
            fetch(API_BASE_URL + "/create_user_code")
                .then((response) => response.json())
                .then((data) => {
                    const userCode = data["user_code"];
                    const creationTime = data["creation_time"];

                    localStorage.setItem("userCode", userCode);
                    localStorage.setItem("creationTime", creationTime);
                });
        }
    }, []);

    function createSession() {
        setStatus("loading");
        const minIMDB = document.querySelector(".min-imdb").value || 0;
        const maxIMDB = document.querySelector(".max-imdb").value || 10;
        const minYear =
            document.querySelector(".min-release-year").value || 1900;
        const maxYear =
            document.querySelector(".max-release-year").value || 2024;
        const movieCount =
            document.querySelector(".movie-count-selection-input").value || 2;
        const sessionName =
            document.querySelector(".session-name-selection-input").value ||
            "Unnamed";

        let type;

        if (selectedTypes.length === 2) {
            type = "all";
        } else if (selectedTypes.length === 1) {
            if (selectedTypes[0] === "Tv Shows") {
                type = "series";
            } else {
                type = "movie";
            }
        }

        const session = {
            user_code: localStorage.getItem("userCode"),
            session_name: sessionName,
            genres: selectedGenres,
            movie_count: movieCount,
            creation_time: localStorage.getItem("creationTime"),
            min_imdb: minIMDB,
            max_imdb: maxIMDB,
            min_year: minYear,
            max_year: maxYear,
            admin: localStorage.getItem("userCode"),
            type: type,
        };

        fetch(API_BASE_URL + "/create_session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(session),
        })
            .then((response) => response.json())
            .then((data) => {
                setStatus("done");
                window.location.href = "/session/" + data["session_code"];
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
    }

    if (isFetchDone && status === "create") {
        return (
            <div className="create-page">
                <div className="cp-header">Create Your Custom Session</div>
                <div className="cp-container">
                    <TypeSelection
                        selectedTypes={selectedTypes}
                        setSelectedTypes={setSelectedTypes}
                    />
                    <GenreSelection
                        genres={genres}
                        setSelectedGenres={setSelectedGenres}
                        selectedGenres={selectedGenres}
                    />
                    <IMDBSelection />
                    <ReleaseYearSelection />
                    <MovieCountSelection />
                    <SessionNameSelection />
                </div>

                <div className="create-session-btn" onClick={createSession}>
                    CREATE
                </div>
            </div>
        );
    } else if (!isFetchDone) {
        return <LoadingScreen />;
    } else if (isFetchDone && status === "loading") {
        return <LoadingScreen />;
    }
}
