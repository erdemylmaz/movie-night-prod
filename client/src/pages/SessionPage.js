import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { API_BASE_URL } from "../App";
import "../styles/SessionPage.css";

import LoadingScreen from "../components/createPageComponents/LoadingScreen";

import SPMovies from "../components/sessionPageComponents/SPMovies";
import Selection from "../components/sessionPageComponents/Selection";
import RankingArea from "../components/sessionPageComponents/RankingArea";

export default function SessionPage() {
    const { session_code } = useParams();
    const [session, setSession] = useState(null);
    const [sessionStatus, setSessionStatus] = useState("not-found");

    const [copyStatus, setCopyStatus] = useState(false);

    const [userSelections, setUserSelections] = useState({});
    const [currentPairs, setCurrentPairs] = useState([]);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [currentPair, setCurrentPair] = useState(null);
    const [currentSelectionIndex, setCurrentSelectionIndex] = useState(0);
    const [tempMovies, setTempMovies] = useState([]);
    const [sessionRanking, setSessionRanking] = useState([]);

    const [userRanking, setUserRanking] = useState([]);

    async function FetchSession() {
        let temp_session;

        await fetch(API_BASE_URL + "/sessions")
            .then((response) => response.json())
            .then(async (data) => {
                if (data["sessions"].includes(session_code)) {
                    setSessionStatus("not-started");
                    await fetch(API_BASE_URL + "/session/" + session_code, {
                        headers: { "Content-Type": "application/json" },
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            setSession(data["session"]);
                            temp_session = data["session"];

                            for (
                                let i = 0;
                                i < data["session"].movies.length;
                                i++
                            ) {
                                userSelections[
                                    JSON.parse(
                                        JSON.stringify(
                                            data["session"].movies[i].title
                                        )
                                    )
                                        .split(" ")
                                        .join("_")
                                ] = 0;
                            }

                            setUserSelections(userSelections);

                            document.title =
                                data["session"]["name"] + " - Movie Night";

                            if (!localStorage.getItem("userCode")) {
                                fetch(API_BASE_URL + "/create_user_code")
                                    .then((response) => response.json())
                                    .then((data) => {
                                        const userCode = data["user_code"];
                                        const creationTime =
                                            data["creation_time"];

                                        localStorage.setItem(
                                            "userCode",
                                            userCode
                                        );
                                        localStorage.setItem(
                                            "creationTime",
                                            creationTime
                                        );
                                    });
                            }
                        });
                } else {
                    setSessionStatus("not-found");
                }
            });

        return temp_session;
    }

    async function GetUsersCompleationStatus() {
        const user_code = localStorage.getItem("userCode");
        const data = {
            user_code: user_code,
            session_code: session_code,
        };

        let status = false;

        if (user_code) {
            await fetch(API_BASE_URL + "/get_user_compleation_status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "completed") {
                        status = true;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        return status;
    }

    async function GetUserRankingFromAPI() {
        const user_code = localStorage.getItem("userCode");
        let ranking;

        await fetch(API_BASE_URL + "/get_user_ranking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_code: user_code,
                session_code: session_code,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                // modify data to match them with original movie obj
                ranking = data.ranking;
            })
            .catch((err) => {
                console.log(err);
            });

        return ranking;
    }

    async function GetSessionRankingFromAPI() {
        let temp_ranking = [];

        await fetch(API_BASE_URL + "/get_session_ranking/" + session_code)
            .then((response) => response.json())
            .then((data) => {
                let responseData = data.ranking;
                responseData.sort((a, b) => b.score - a.score);
                responseData.forEach((mov) => {
                    session.movies.forEach((movie) => {
                        if (mov.movie_id === movie.netflixid) {
                            temp_ranking.push(movie);
                        }
                    });
                });

                setSessionRanking(temp_ranking);
            });
    }

    async function InitSession() {
        // if user already completed that session, init end-page
        // store that data inside database

        const isCompleted = await GetUsersCompleationStatus();
        if (isCompleted) {
            // update session ranking & user ranking
            setSessionStatus("loading");
            const ranking = await GetUserRankingFromAPI();
            const temp_session = await FetchSession();
            const sessionMovies = temp_session.movies;

            ranking.forEach((rankedMovie) => {
                sessionMovies.forEach((movie) => {
                    if (movie.title === rankedMovie.title) {
                        movie.score = rankedMovie.score;
                    }
                });
            });

            sessionMovies.sort((a, b) => b.score - a.score);
            setUserRanking(sessionMovies);
            setSessionStatus("vote-ended");
        } else {
            if (!session) {
                await FetchSession();
            }
        }
    }

    useEffect(() => {
        InitSession();
    }, [currentSelectionIndex, currentPairIndex, sessionRanking]);

    function copyLink() {
        navigator.clipboard.writeText(LINK);
        setCopyStatus(true);
    }

    function createPairs(index, movies = session["movies"]) {
        let usedIndexes = [];
        let pairs = [];

        for (let i = 0; i < session["movie_count"] / 2 ** index; i++) {
            // movies.length ?
            if (i % 2 === 0) {
                pairs.push({ winner: false, movies: [] });
            }

            let randomIndex = Math.floor(Math.random() * movies.length);

            while (usedIndexes.includes(randomIndex)) {
                randomIndex = Math.floor(Math.random() * movies.length);
            }

            usedIndexes.push(randomIndex);
            const movie = movies[randomIndex];

            pairs[Math.floor(i / 2)].movies.push(movie);
        }

        setCurrentPair(pairs);

        if (index === 0) {
            setCurrentPairs([...currentPairs, pairs, []]);
        } else {
            currentPairs[currentPairs.length - 1] = pairs;
            setCurrentPairs([...currentPairs, []]);
        }
    }

    function startSession() {
        setSessionStatus("started");
    }

    async function InsertSelections() {
        setSessionStatus("loading");
        const userCode = localStorage.getItem("userCode");
        const selections = GetUserRanking();

        for (let i = 0; i < selections.length; i++) {
            selections[i].score =
                userSelections[selections[i].title.split(" ").join("_")];
        }

        const data = {
            user_code: userCode,
            session_code: session_code,
            selections: selections,
        };

        await fetch(API_BASE_URL + "/insert_user_selections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });

        setSessionStatus("vote-ended");
    }

    function GetUserRanking() {
        // rank by user selections
        const tempArray = [];
        const rankedMovies = [];
        for (var title in userSelections) {
            tempArray.push({ count: userSelections[title], title: title });
        }

        tempArray.sort((a, b) => a.count - b.count);

        tempArray.forEach((movie) => {
            const movObj = session["movies"].find(
                (mov) =>
                    JSON.parse(JSON.stringify(mov.title))
                        .split(" ")
                        .join("_") === movie.title
            );

            rankedMovies.push(movObj);
        });

        return rankedMovies;
    }

    const BASE_URL = "movienight.com";
    const LINK = BASE_URL + "/session" + "/" + session_code;

    // make them components
    if (sessionStatus === "not-started" && session) {
        if (!currentPairs[0]) {
            createPairs(0);
        }

        return (
            <div className="session-page">
                <div className="cp-header">{session["name"]} - Lobby</div>
                <div className="cp-copy-link-area">
                    <div className="cp-link">{LINK}</div>
                    <div className="cp-copy-btn" onClick={copyLink}>
                        {copyStatus ? (
                            <i className="fa-solid fa-copy"></i>
                        ) : (
                            <i className="fa-regular fa-copy"></i>
                        )}
                    </div>
                </div>
                <div className="sp-start-btn" onClick={startSession}>
                    Start Voting
                </div>
                <div className="cp-container" style={{ marginTop: 8 }}>
                    <SPMovies movies={session["movies"]}></SPMovies>
                </div>
            </div>
        );
    } else if (sessionStatus === "not-found") {
        return (
            <div className="session-page">
                Session {session_code} not found, please check again.
            </div>
        );
    } else if (sessionStatus === "started") {
        if (currentPairs[currentPairIndex].length === 0) {
            createPairs(
                currentPairIndex,
                tempMovies ? tempMovies : session["movies"]
            );

            setTempMovies([]);
        }

        // seperate these to components
        return (
            <div className="started-session">
                <div className="selection-page-header">
                    <div className="selection-current-index">
                        {currentSelectionIndex + 1} / {currentPair.length}
                    </div>

                    <div className="selection-header-text">
                        Please select which one do you prefer?
                    </div>
                </div>

                <div className="selections-area">
                    <Selection
                        tempMovies={tempMovies}
                        setTempMovies={setTempMovies}
                        currentPairIndex={currentPairIndex}
                        setCurrentPairIndex={setCurrentPairIndex}
                        setUserSelections={setUserSelections}
                        userSelections={userSelections}
                        currentPairs={currentPairs}
                        setCurrentPairs={setCurrentPairs}
                        currentSelectionIndex={currentSelectionIndex}
                        setCurrentSelectionIndex={setCurrentSelectionIndex}
                        movie={currentPair[currentSelectionIndex].movies[0]}
                        setSessionStatus={setSessionStatus}
                        InsertSelections={InsertSelections}
                    />
                    <div className="selection-line"></div>
                    <Selection
                        tempMovies={tempMovies}
                        setTempMovies={setTempMovies}
                        currentPairIndex={currentPairIndex}
                        setCurrentPairIndex={setCurrentPairIndex}
                        setUserSelections={setUserSelections}
                        userSelections={userSelections}
                        currentPairs={currentPairs}
                        setCurrentPairs={setCurrentPairs}
                        currentSelectionIndex={currentSelectionIndex}
                        setCurrentSelectionIndex={setCurrentSelectionIndex}
                        movie={currentPair[currentSelectionIndex].movies[1]}
                        InsertSelections={InsertSelections}
                    />
                </div>
            </div>
        );
    } else if (sessionStatus === "vote-ended") {
        // Get session ranking
        if (sessionRanking.length === 0) {
            GetSessionRankingFromAPI();
        }

        if (userRanking.length === 0) {
            const userRanking = GetUserRanking();
        }

        return (
            <div className="sp-end-screen">
                <div className="sp-end-header">{session["name"]}</div>
                <div className="cp-copy-link-area">
                    <div className="cp-link">{LINK}</div>
                    <div className="cp-copy-btn" onClick={copyLink}>
                        {copyStatus ? (
                            <i className="fa-solid fa-copy"></i>
                        ) : (
                            <i className="fa-regular fa-copy"></i>
                        )}
                    </div>
                </div>
                {sessionRanking.length !== 0 ? (
                    <RankingArea
                        type="session"
                        sessionRanking={sessionRanking}
                        userRanking={userRanking}
                    />
                ) : (
                    ""
                )}
                <RankingArea
                    type="user"
                    sessionRanking={sessionRanking}
                    userRanking={userRanking}
                />
            </div>
        );
    } else {
        return <LoadingScreen />;
    }
}
