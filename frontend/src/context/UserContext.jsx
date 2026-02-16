import { createContext, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    const refreshToken = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/user/refresh-token`,
                {
                    withCredentials: true,
                }
            );

            console.log(res.data);
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
        let res = null;
        try {
            res = await axios.post(
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
            if (res.data.data) {
                setUser(res.data.data.user);
            } else {
                throw new Error("Login failed");
            }
        } catch (error) {
            console.error(error);
            setUser(null);
        }
        return res?.data;
    };

    const logout = async () => {
        let res = null;
        try {
            res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/logout`,
                {},
                {
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                setUser(null);
            } else {
                throw new Error("Logout failed");
            }
        } catch (error) {
            console.error(error);
        }
        return res?.data;
    };

    return (
        <UserContext.Provider
            value={{
                user,
                refreshToken,
                login,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
