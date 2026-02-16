import { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Profile from "./pages/user/Profile.jsx";
import Login from "./pages/user/Login.jsx";
import Top from "./pages/home/Top.jsx";
import ConnectPage from "./pages/connect/ConnectPage.jsx";
import PostPage from "./pages/post/PostPage.jsx";
import AllProfile from "./pages/user/AllProfile.jsx";
import Register from "./pages/user/Register.jsx";
import CreatePost from "./pages/post/CreatePost.jsx";
import { UserContext } from "./context/UserContext.jsx";

function App() {
    const { user, refreshToken, active } = useContext(UserContext);
    const [navroute, setNavroute] = useState("");

    useEffect(() => {
        refreshToken();
    }, []);

    return (
        <BrowserRouter>
            <Navbar active={active} user={user} navroute={navroute} />
            {/* <div id="main-container"> */}
            <div id="body-container">
                <Routes>
                    <Route
                        path="/"
                        element={<Home setNavroute={setNavroute} />}
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
                            element={<Profile setNavroute={setNavroute} />}
                        />
                        <Route
                            path="/user/profile/:username"
                            element={<AllProfile />}
                        />
                        <Route
                            path="/user/login"
                            element={<Login setNavroute={setNavroute} />}
                        />
                        <Route
                            path="/user/register"
                            element={<Register setNavroute={setNavroute} />}
                        />
                        <Route path="/user/post">
                            <Route
                                path="/user/post/create"
                                element={
                                    <CreatePost setNavroute={setNavroute} />
                                }
                            />
                        </Route>
                    </Route>
                    <Route
                        path="/connect"
                        element={<ConnectPage setNavroute={setNavroute} />}
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
