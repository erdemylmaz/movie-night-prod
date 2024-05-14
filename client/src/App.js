import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import SessionPage from "./pages/SessionPage";

const API_BASE_URL = "https://e57b-88-242-71-4.ngrok-free.app/api";
// const API_BASE_URL = "http://localhost:5050/api";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route
                    path="/session/:session_code"
                    element={<SessionPage />}
                />
            </Routes>
        </div>
    );
}

export { App, API_BASE_URL };
