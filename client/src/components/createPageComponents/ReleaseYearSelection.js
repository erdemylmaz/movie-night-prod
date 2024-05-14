import React from "react";

export default function ReleaseYearSelection() {
    return (
        <div className="release-year-selection-area">
            <div className="selection-title">
                Release Year <span className="small-info-text">(optional)</span>
            </div>
            <div className="release-year-selection-inputs">
                <input
                    type="number"
                    className="min-release-year release-year-input"
                    placeholder="Min."
                    min="1900"
                    max="2022"
                />
                <div className="release-year-to-text">to</div>
                <input
                    type="number"
                    className="max-release-year release-year-input"
                    placeholder="2024"
                    min="1900"
                    max="2024"
                />
            </div>
        </div>
    );
}
