import { createContext, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [active, setActive] = useState(false);

    const refreshToken = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/user/refresh-token`,
                {
                    withCredentials: true,
                }
            );

            console.log(res.data);
            setActive(res.data.success);
            if (res.data.data) {
                setUser(res.data.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const login = async (uid, password) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/login`,
                {
                    uid,
                    password,
                },
                {
                    withCredentials: true,
                }
            );

            console.log(res.data);
            setActive(res.data.success);
            if (res.data.data) {
                setUser(res.data.data.user);
            } else {
                setUser(null);
            }

            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <UserContext.Provider
            value={{ user, setUser, refreshToken, login, active, setActive }}
        >
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
