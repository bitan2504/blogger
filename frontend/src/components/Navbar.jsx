import { useState, useEffect } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import axios from "axios";

export default function Navbar({ active, setActive }) {
  const [username, setUsername] = useState("");

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
          setUsername(foundUser.data.data.username);
        } else {
          setUsername(null);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, [active]);

  return (
    <nav id="navbar" className="navbar">
      <div className="navbar-container">
        <NavLink to="/home" className="navbar-items">
          Home
        </NavLink>
        <NavLink to="/home/top" className="navbar-items">
          Top
        </NavLink>
        <NavLink to="/home/following" className="navbar-items">
          Following
        </NavLink>
        <NavLink to="/connect" className="navbar-items">
          Connect
        </NavLink>
      </div>
      <div className="navbar-container">
        {!active ? (
          <>
            <NavLink to="/user/login" className="navbar-items">
              Login
            </NavLink>
            <NavLink to="/user/register" className="navbar-items">
              Register
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/user/profile" className="navbar-items">
              {username}
            </NavLink>
            <NavLink to="/user/post/create">
              <button>Create Post</button>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
