import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Tab title change when hidden (same as original script.js)
const originalTitle = document.title;
document.addEventListener("visibilitychange", () => {
    document.title =
        document.visibilityState === "hidden"
            ? "Come back to explore more!"
            : originalTitle;
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
