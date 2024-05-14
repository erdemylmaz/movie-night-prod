import userEvent from "@testing-library/user-event";
import React from "react";

export default function Selection({
    movie,
    currentPairs,
    setCurrentPairs,
    currentSelectionIndex,
    setCurrentSelectionIndex,
    userSelections,
    setUserSelections,
    currentPairIndex,
    setCurrentPairIndex,
    createPairs,
    tempMovies,
    setTempMovies,
    InsertSelections,
}) {
    function selectSelection(e) {
        if (
            e.target.localName != "a" &&
            currentPairs[currentPairIndex].length != 1
        ) {
            userSelections[
                JSON.parse(JSON.stringify(movie.title)).split(" ").join("_")
            ] += 1;

            tempMovies.push(movie);
            setTempMovies(tempMovies);

            // add this movie to next pairs
            // then shuffle the pairs

            setUserSelections(userSelections);

            // initialize big selection for 1-2 seconds,
            setCurrentSelectionIndex(currentSelectionIndex + 1);

            if (
                currentSelectionIndex + 1 ==
                currentPairs[currentPairIndex].length
            ) {
                setCurrentPairIndex(currentPairIndex + 1);
                setCurrentPairIndex(currentPairIndex + 1);
                setCurrentSelectionIndex(0);
            }
        } else if (currentPairs[currentPairIndex].length == 1) {
            userSelections[
                JSON.parse(JSON.stringify(movie.title)).split(" ").join("_")
            ] += 1;

            setUserSelections(userSelections);

            InsertSelections();
        }
    }

    return (
        <div className="selection" onClick={selectSelection}>
            <div className="selection-img-area">
                <img className="selection-img" src={movie.imgurl} />
            </div>

            <div className="selection-info-area">
                <a
                    href={`https://www.netflix.com/title/${movie.netflixid}`}
                    target="_blank"
                    className="selection-title"
                >
                    {JSON.parse(JSON.stringify(movie.title))}{" "}
                    <i className="fa-solid fa-up-right-from-square"></i>
                </a>
                <div className="selection-details-area">
                    <div className="selection-detail">{movie.vtype}</div>
                    <div className="detail-icon selection-detail-icon">•</div>
                    <div className="selection-detail">{movie.year}</div>
                    <div className="detail-icon selection-detail-icon">•</div>
                    <div className="selection-detail">
                        {movie.runtime >= 60
                            ? `${Math.floor(movie.runtime / 60 / 60)}h `
                            : ""}
                        {movie.runtime % 60 != 0
                            ? `${Math.floor(movie.runtime % 60)}min`
                            : ""}
                    </div>
                    <div className="detail-icon selection-detail-icon">•</div>
                    <div className="selection-detail">{movie.imdbrating}</div>
                </div>
            </div>
        </div>
    );
}
