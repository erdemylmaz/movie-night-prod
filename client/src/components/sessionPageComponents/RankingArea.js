import React, { useState, useEffect } from "react";

import ImageBasedRankItem from "../sessionPageComponents/ImageBasedRankItem";
import TextBasedRankItem from "../sessionPageComponents/TextBasedRankItem";

export default function RankingArea({ sessionRanking, userRanking, type }) {
    const [showingCount, setShowingCount] = useState(3);
    const [showingRanking, setShowingRanking] = useState([]);

    let mainRanking;
    let otherRanking;
    if (type == "user") {
        mainRanking = [...userRanking];
        otherRanking = [...sessionRanking];
    } else {
        otherRanking = [...userRanking];
        mainRanking = [...sessionRanking];
    }

    useEffect(() => {
        setShowingRanking(mainRanking.splice(0, showingCount));
        // setShowingRanking(mainRanking.splice(0, showingCount));
    }, [showingCount]);

    function showMore() {
        setShowingCount(showingCount + 5);
    }

    return (
        <div className="ranking-area">
            <div className="ranking-area-title">
                {type == "user" ? "Your Ranking" : "Session Ranking"}
            </div>

            <div className="ranking-list">
                {showingRanking.map((movie, index) => {
                    let sessionIndex;
                    let userIndex = index;
                    if (type == "user") {
                        for (let i = 0; i < sessionRanking.length; i++) {
                            if (sessionRanking[i].title == movie.title) {
                                sessionIndex = i;
                                break;
                            }
                        }
                    } else {
                        for (let i = 0; i < userRanking.length; i++) {
                            if (userRanking[i].title == movie.title) {
                                userIndex = i;
                                sessionIndex = index;
                                break;
                            }
                        }
                    }

                    if (index < 3) {
                        return (
                            <ImageBasedRankItem
                                key={index}
                                movie={movie}
                                userRankIndex={userIndex}
                                sessionRankIndex={sessionIndex}
                                type={type}
                            />
                        );
                    } else {
                        return (
                            <TextBasedRankItem
                                key={index}
                                movie={movie}
                                userRankIndex={userIndex}
                                sessionRankIndex={sessionIndex}
                                type={type}
                            />
                        );
                    }
                })}
                {showingCount < userRanking.length ? (
                    <div className="show-more-btn" onClick={showMore}>
                        See More
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}
