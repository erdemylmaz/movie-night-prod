import React from "react";

export default function LoadingScreen({ text = "Loading" }) {
    return (
        <div className="loading-screen">
            <div className="loading-area">
                <div className="loading-icon"></div>
            </div>
        </div>
    );
}
