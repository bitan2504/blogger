import { useState, useEffect } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import ConnectSvg from "../../public/img/ConnectSvg.jsx";
import FollowingSvg from "../../public/img/FollowingSvg.jsx";
import TopSvg from "../../public/img/TopSvg.jsx";
import HomeSvg from "../../public/img/HomeSvg.jsx";
import CreateSvg from "../../public/img/CreateSvg.jsx";

export default function Navbar({ active, user }) {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    setUsername(user?.username);
  }, [user]);

  return (
    <nav id="navbar" className="navbar">
      <img id="logo" src="/img/navbar.png" alt="" />
      <div className="navbar-container">
        <NavLink to="/home" className="navbar-items">
          <HomeSvg />
        </NavLink>
        <NavLink to="/home/top" className="navbar-items">
          <TopSvg />
        </NavLink>
        <NavLink to="/home/following" className="navbar-items">
          <FollowingSvg />
        </NavLink>
        <NavLink to="/connect" className="navbar-items">
          <ConnectSvg />
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
            <button id="create-post-button">
              <NavLink id="create-post" to="/user/post/create">
                Create Posts
              </NavLink>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
