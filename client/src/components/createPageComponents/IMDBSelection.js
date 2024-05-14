import React from "react";

export default function IMDBSelection() {
    return (
        <div className="imdb-selection-area">
            <div className="selection-title">
                IMDB <span className="small-info-text">(optional)</span>
            </div>
            <div className="imdb-selection-inputs">
                <input
                    type="number"
                    className="min-imdb imdb-input"
                    placeholder="0"
                    min="0"
                    max="10"
                />
                <div className="imdb-to-text">to</div>
                <input
                    type="number"
                    className="max-imdb imdb-input"
                    placeholder="10"
                    min="0"
                    max="10"
                />
            </div>
        </div>
    );
}
