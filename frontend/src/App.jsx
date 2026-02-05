import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Login from "./pages/profile/Login.jsx";
import Top from "./pages/home/Top.jsx";
import ConnectPage from "./pages/connect/ConnectPage.jsx";
import axios from "axios";
import PostPage from "./pages/Post/PostPage.jsx";
import AllProfile from "./pages/profile/AllProfile.jsx";
import Register from "./pages/profile/Register.jsx";
import CreatePost from "./pages/Post/CreatePost.jsx";

function App() {
    const [active, setActive] = useState(false);
    const [user, setUser] = useState(null);
    const [navroute, setNavroute] = useState("");

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
                    <Route
                        path="/"
                        element={
                            <Home active={active} setNavroute={setNavroute} />
                        }
                    />
                    <Route path="/home">
                        <Route
                            path="/home"
                            element={<Home setNavroute={setNavroute} />}
                        />
                        <Route
                            path="/home/top"
                            element={<Top setNavroute={setNavroute} />}
                        />
                    </Route>
                    <Route path="/user">
                        <Route
                            path="/user/profile"
                            element={
                                <Profile
                                    active={active}
                                    setActive={setActive}
                                    setNavroute={setNavroute}
                                />
                            }
                        />
                        <Route
                            path="/user/profile/:username"
                            element={
                                <AllProfile
                                    active={active}
                                    setActive={setActive}
                                    setNavroute={setNavroute}
                                    currentUser={user}
                                />
                            }
                        />
                        <Route
                            path="/user/login"
                            element={
                                <Login
                                    active={active}
                                    setActive={setActive}
                                    setNavroute={setNavroute}
                                />
                            }
                        />
                        <Route
                            path="/user/register"
                            element={
                                <Register
                                    active={active}
                                    setNavroute={setNavroute}
                                />
                            }
                        />
                        <Route path="/user/post">
                            <Route
                                path="/user/post/create"
                                element={
                                    <CreatePost
                                        user={user}
                                        setNavroute={setNavroute}
                                    />
                                }
                            />
                        </Route>
                    </Route>
                    <Route
                        path="/connect"
                        element={
                            <ConnectPage
                                active={active}
                                setNavroute={setNavroute}
                                currentUser={user}
                            />
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
