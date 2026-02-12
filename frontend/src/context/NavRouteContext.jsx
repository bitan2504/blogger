import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const NavRouteContext = createContext();

export default function NavRouteProvider({ children }) {
    const [navroute, setNavroute] = useState("");
    return (
        <NavRouteContext.Provider value={{ navroute, setNavroute }}>
            {children}
        </NavRouteContext.Provider>
    );
}

NavRouteProvider.propTypes = { children: PropTypes.node.isRequired };
