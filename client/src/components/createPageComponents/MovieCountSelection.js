import React from "react";

export default function MovieCountSelection() {
    return (
        <div className="movie-count-selection-area">
            <div className="selection-title">Movie Count</div>
            <select className="movie-count-selection-input">
                {[...Array(6).keys()].map((i) => {
                    return (
                        <option key={i + 1} value={2 ** (i + 1)}>
                            {2 ** (i + 1)}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}
