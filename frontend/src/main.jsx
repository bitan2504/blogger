import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserProvider from "./context/UserContext.jsx";
import NavRouteProvider from "./context/NavRouteContext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <UserProvider>
            <NavRouteProvider>
                <App />
            </NavRouteProvider>
        </UserProvider>
    </StrictMode>
);
