import React, { useEffect, useState } from "react";

export default function GenreSelection({
    genres,
    setSelectedGenres,
    selectedGenres,
}) {
    const [buttonStatus, setButtonStatus] = useState("disable");

    useEffect(() => {
        if (selectedGenres.length < genres.length) {
            setButtonStatus("Enable All");
        } else if (selectedGenres.length === genres.length) {
            setButtonStatus("Disable All");
        }
    }, [selectedGenres]);

    function handleClick(e) {
        const option = e.currentTarget.getAttribute("data-option");
        const status = e.currentTarget.getAttribute("data-status");

        if (status === "selected") {
            selectedGenres = selectedGenres.filter(
                (genre) => genre["name"] != option
            );

            setSelectedGenres(selectedGenres);
            e.currentTarget.setAttribute("data-status", "unselected");
            e.currentTarget.classList.remove("selected-option");
        } else {
            selectedGenres = [...selectedGenres, option];
            setSelectedGenres(selectedGenres);
            e.currentTarget.setAttribute("data-status", "selected");
            e.currentTarget.classList.add("selected-option");
        }
    }

    function handleBigButtonClick(e) {
        const buttons = document.querySelectorAll(".genre-selection-option");
        if (buttonStatus === "Enable All") {
            setSelectedGenres(genres);
            buttons.forEach((button) => {
                button.setAttribute("data-status", "selected");
                button.classList.add("selected-option");
            });
        } else {
            setSelectedGenres([]);

            buttons.forEach((button) => {
                button.setAttribute("data-status", "unselected");
                button.classList.remove("selected-option");
            });
        }
    }

    return (
        <div className="genre-selection-area">
            <div className="selection-title">Genre</div>
            <div
                className="genre-selection-big-button"
                onClick={handleBigButtonClick}
            >
                {buttonStatus}
            </div>
            <div className="selection-options genre-selection-options">
                {genres.map((genre, index) => {
                    return (
                        <div
                            key={index}
                            onClick={handleClick}
                            className="selection-option genre-selection-option selected-option"
                            data-status="selected"
                            data-option={genre}
                        >
                            <div className="option-title">{genre}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
