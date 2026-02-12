import { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Login from "./pages/profile/Login.jsx";
import Top from "./pages/home/Top.jsx";
import ConnectPage from "./pages/connect/ConnectPage.jsx";
import axios from "axios";
import PostPage from "./pages/post/PostPage.jsx";
import AllProfile from "./pages/profile/AllProfile.jsx";
import Register from "./pages/profile/Register.jsx";
import CreatePost from "./pages/post/CreatePost.jsx";
import { VerifyEmail } from "./pages/profile/VerifyEmail.jsx";
import { UserContext } from "./context/UserContext.jsx";
import { NavRouteContext } from "./context/NavRouteContext.jsx";

function App() {
    const { navroute } = useContext(NavRouteContext);
    const { user, setUser, active, setActive } = useContext(UserContext);

    useEffect(() => {
        const getUser = async () => {
            try {
                const foundUser = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/user/getUser`,
                    {
                        withCredentials: true,
                    }
                );

                setActive(foundUser.data.data ? true : false);
                if (foundUser.data.data) {
                    setUser(foundUser.data.data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error(error);
            }
        };
        getUser();
    }, [active]);

    return (
        <BrowserRouter>
            <Navbar active={active} user={user} navroute={navroute} />
            {/* <div id="main-container"> */}
            <div id="body-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home">
                        <Route path="/home" element={<Home />} />
                        <Route path="/home/top" element={<Top />} />
                    </Route>
                    <Route path="/user">
                        <Route path="/user/profile" element={<Profile />} />
                        <Route
                            path="/user/profile/:username"
                            element={<AllProfile />}
                        />
                        <Route path="/user/login" element={<Login />} />
                        <Route path="/user/register" element={<Register />} />
                        <Route
                            path="/user/verify-email"
                            element={<VerifyEmail />}
                        />
                        <Route path="/user/post">
                            <Route
                                path="/user/post/create"
                                element={<CreatePost />}
                            />
                        </Route>
                    </Route>
                    <Route
                        path="/connect"
                        element={
                            <ConnectPage active={active} currentUser={user} />
                        }
                    />
                    <Route path="/post">
                        <Route path=":postID" element={<PostPage />} />
                    </Route>
                </Routes>
            </div>
            {/* <MenuBar user={user} /> */}
            {/* </div> */}
        </BrowserRouter>
    );
}

export default App;
