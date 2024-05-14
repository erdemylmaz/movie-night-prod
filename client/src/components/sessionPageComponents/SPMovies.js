import SPMovie from "./SPMovie";
import React from "react";

export default function SPMovies({ movies }) {
    return (
        <div className="sp-movies">
            <div className="sp-movies-title">
                Session Movies{" "}
                <span className="small-info-text">({movies.length})</span>
                <span className="small-info-text">(unordered)</span>
            </div>
            <div className="sp-movies-list">
                {movies.map((movie, index) => {
                    return <SPMovie movie={movie} index={index} key={index} />;
                })}
            </div>
        </div>
    );
}
