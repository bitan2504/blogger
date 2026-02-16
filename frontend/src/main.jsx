import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { NavrouteProvider } from "./context/NavrouteContext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <UserProvider>
            <NavrouteProvider>
                <App />
            </NavrouteProvider>
        </UserProvider>
    </StrictMode>
);
