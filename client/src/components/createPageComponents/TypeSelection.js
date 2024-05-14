import React, { useState } from "react";

export default function TypeSelection({ selectedTypes, setSelectedTypes }) {
    function handleClick(e) {
        const option = e.currentTarget.getAttribute("data-option");
        const status = e.currentTarget.getAttribute("data-status");

        if (status === "selected") {
            selectedTypes = selectedTypes.filter((type) => type !== option);
            setSelectedTypes(selectedTypes);
            e.currentTarget.setAttribute("data-status", "unselected");
            e.currentTarget.classList.remove("selected-option");
        } else {
            selectedTypes = [...selectedTypes, option];
            setSelectedTypes(selectedTypes);
            e.currentTarget.setAttribute("data-status", "selected");
            e.currentTarget.classList.add("selected-option");
        }
    }

    return (
        <div className="type-selection-area">
            <div className="selection-title">Type</div>
            <div className="selection-options">
                <div
                    className="selection-option selected-option"
                    onClick={handleClick}
                    data-status="selected"
                    data-option="Tv Shows"
                >
                    <div className="option-title">Tv Shows</div>
                </div>

                <div
                    onClick={handleClick}
                    className="selection-option selected-option"
                    data-status="selected"
                    data-option="Movie"
                >
                    <div className="option-title">Movie</div>
                </div>
            </div>
        </div>
    );
}
