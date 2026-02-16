import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const NavrouteContext = createContext();

export function NavrouteProvider({ children }) {
    const [navroute, setNavroute] = useState("/");

    return (
        <NavrouteContext.Provider value={{ navroute, setNavroute }}>
            {children}
        </NavrouteContext.Provider>
    );
}

NavrouteProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
