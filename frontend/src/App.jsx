import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import axios from "axios";
import Profile from "./components/Profile.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

function App() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const foundUser = await axios.get(
          "http://localhost:3000/user/getUser",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            }
          }
        );
        console.log(foundUser.data.user);
        if (foundUser.data.user) {
          setUsername(foundUser.data.user.username);
        }
      } catch (error) {
        // console.error(error);
      }
    };
    getUser();
  }, []);

  return (
    <BrowserRouter>
      <div id="main-container">
        <Navbar username={username} setUsername={setUsername} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user">
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/user/register" element={<Register />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
