import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Login from "./pages/profile/Login.jsx";
import Register from "./pages/profile/Register.jsx";
import CreatePost from "./components/CreatePost.jsx";
import ShowPost from "./components/ShowPost.jsx";
import Top from "./pages/home/Top.jsx";
import Connect from "./pages/connect/Connect.jsx";
import MenuBar from './components/MenuBar';
import axios from "axios";

function App() {
  const [active, setActive] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const foundUser = await axios.get(
          "http://localhost:3000/user/getUser",
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
      <Navbar active={active} user={user} />
      <div id="main-container">
        <div id="body-container">
          <Routes>
            <Route path="/" element={<Home active={active} />} />
            <Route path="/home">
              <Route path="/home" element={<Home />} />
              <Route path="/home/top" element={<Top />} />
            </Route>
            <Route path="/user">
              <Route
                path="/user/profile"
                element={<Profile active={active} setActive={setActive} />}
              />
              <Route
                path="/user/login"
                element={<Login active={active} setActive={setActive} />}
              />
              <Route
                path="/user/register"
                element={<Register active={active} />}
              />
              <Route path="/user/post">
                <Route
                  path="/user/post/create"
                  element={<CreatePost active={active} />}
                />
                <Route
                  path="/user/post/show"
                  element={<ShowPost active={active} />}
                />
              </Route>
            </Route>
            <Route path="/connect" element={<Connect active={active} />} />
          </Routes>
        </div>
        <MenuBar user={user} />
      </div>
    </BrowserRouter>
  );
}

export default App;
