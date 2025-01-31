import { useState } from "react";
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

function App() {
  const [active, setActive] = useState(false);

  return (
    <BrowserRouter>
      <div id="main-container">
        <Navbar active={active} setActive={setActive} />
        <Routes>
          <Route path="/" element={<Home active={active} />} />
          <Route path="/home">
            <Route path="/home" element={<Home />} />
            <Route path="/home/top" element={<Top />} />
          </Route>
          <Route path="/user">
            <Route path="/user/profile" element={<Profile active={active} setActive={setActive} />} />
            <Route path="/user/login" element={<Login active={active} setActive={setActive} />} />
            <Route path="/user/register" element={<Register active={active} />} />
            <Route path="/user/post">
              <Route path="/user/post/create" element={<CreatePost active={active} />} />
              <Route path="/user/post/show" element={<ShowPost active={active} />} />
            </Route>
          </Route>
          <Route path="/connect" element={<Connect active={active} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
