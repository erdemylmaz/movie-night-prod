import React from "react";

export default function SPMovie({ movie, index }) {
    return (
        <a
            target="_blank"
            href={`https://www.netflix.com/title/` + movie.netflixid}
            className="sp-movie"
        >
            <div className="sp-movie-index">{index + 1}</div>
            <div className="sp-movie-mid">
                <div className="sp-movie-mid-top">
                    {JSON.parse(JSON.stringify(movie.title))}
                    <i className="fa-solid fa-up-right-from-square"></i>
                </div>
                <div className="sp-movie-details">
                    <div className="sp-movie-detail">{movie.year}</div>
                    <div className="detail-icon">•</div>
                    <div className="sp-movie-detail">
                        {movie.runtime >= 60
                            ? `${Math.floor(movie.runtime / 60 / 60)}h `
                            : ""}
                        {movie.runtime % 60 != 0
                            ? `${Math.floor(movie.runtime % 60)}min`
                            : ""}
                    </div>
                    <div className="detail-icon">•</div>
                    <div className="sp-movie-detail">{movie.imdbrating}</div>
                </div>
            </div>
            <div className="sp-movie-img-area">
                <img src={movie.imgurl} className="sp-movie-img" />
            </div>
        </a>
    );
}
