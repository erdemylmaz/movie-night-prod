import React from "react";

export default function ImageBasedRankItem({
    movie,
    sessionRankIndex,
    userRankIndex,
    type,
}) {
    let mainRankIndex;
    let otherRankIndex;

    if (type === "user") {
        mainRankIndex = userRankIndex;
        otherRankIndex = sessionRankIndex;
    } else {
        mainRankIndex = sessionRankIndex;
        otherRankIndex = userRankIndex;
    }

    return (
        <div className="image-based-rank-item">
            <div className="image-based-img-area">
                <div className="image-based-rank-index-area">
                    <div className="main-rank-index">{mainRankIndex + 1}</div>
                    <div className="other-rank-index">{otherRankIndex + 1}</div>
                </div>

                <img
                    src={movie.imgurl}
                    alt={movie.title}
                    className="image-based-img"
                />
            </div>

            <div className="image-based-info-area">
                <a
                    href={`https://www.netflix.com/title/${movie.netflixid}`}
                    className="image-based-movie-title"
                >
                    {JSON.parse(JSON.stringify(movie.title))}
                    <i className="fa-solid fa-up-right-from-square"></i>
                </a>
                <div className="image-based-details-area">
                    <div className="image-based-detail">{movie.vtype}</div>
                    <div className="detail-icon image-based-detail-icon">•</div>
                    <div className="image-based-detail">
                        {movie.runtime >= 60
                            ? `${Math.floor(movie.runtime / 60 / 60)}h `
                            : ""}
                        {movie.runtime % 60 !== 0
                            ? `${Math.floor(movie.runtime % 60)}min`
                            : ""}
                    </div>
                    <div className="detail-icon image-based-detail-icon">•</div>
                    <div className="image-based-detail">{movie.imdbrating}</div>
                </div>
            </div>
        </div>
    );
}
