import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import axios from "axios";
import Profile from "./components/Profile.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import CreatePost from "./components/CreatePost.jsx";
import ShowPost from "./components/ShowPost.jsx";
import Top from "./components/Top.jsx";

function App() {
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const foundUser = await axios.get(
          "http://localhost:3000/user/getUser",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        
        if (foundUser.data) {
          setUser(foundUser.data);
          setUsername(foundUser.data.username);
        } else {
          setUser(null);
          setUsername(null);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    } else {
      setUsername(null);
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div id="main-container">
        <Navbar username={username} setUsername={setUsername} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" >
            <Route path="/home" element={<Home user={user} />} />
            <Route path="/home/top" element={<Top user={user} />} />
          </Route>
          <Route path="/user">
            <Route path="/user/profile" element={<Profile user={user} setUser={setUser} />} />
            <Route path="/user/login" element={<Login user={user} setUser={setUser} />} />
            <Route path="/user/register" element={<Register user={user} setUser={setUser} />} />
            <Route path="/user/post">
              <Route path="/user/post/create" element={<CreatePost user={user} setUser={setUser} />} />
              <Route path="/user/post/show" element={<ShowPost user={user} /> } />
            </Route>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
