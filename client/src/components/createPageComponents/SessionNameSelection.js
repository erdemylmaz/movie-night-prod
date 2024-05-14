import React from "react";

export default function SessionNameSelection() {
    return (
        <div className="session-name-selection-area">
            <div className="selection-title">Session Name</div>
            <input
                type="text"
                className="session-name-selection-input"
                placeholder="Name..."
            />
        </div>
    );
}
