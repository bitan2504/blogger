import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const UserContext = createContext();

export default function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [active, setActive] = useState(false);

    return (
        <UserContext.Provider value={{ user, setUser, active, setActive }}>
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
