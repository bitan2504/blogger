import { useState, useEffect } from "react";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import ConnectSvg from "../../public/img/ConnectSvg.jsx";
import FollowingSvg from "../../public/img/FollowingSvg.jsx";
import TopSvg from "../../public/img/TopSvg.jsx";
import HomeSvg from "../../public/img/HomeSvg.jsx";
import CreateSvg from "../../public/img/CreateSvg.jsx";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function Navbar({ active, user, navroute }) {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(user?.username);
  }, [user]);

  return (
    <nav id="navbar" className="navbar">
      <img id="logo" src="/img/navbar.png" alt="" />
      <div className="navbar-container">
        <NavLink
          id="home-container"
          to="/home"
          className={
            navroute === "home-container" ? "a-active" : "navbar-items"
          }
        >
          <HomeSvg />
        </NavLink>
        <NavLink
          id="top-container"
          to="/home/top"
          className={navroute === "top-container" ? "a-active" : "navbar-items"}
        >
          <TopSvg />
        </NavLink>
        {/* <NavLink
          id="following-container"
          to="/home/following"
          className={
            navroute === "following-container" ? "a-active" : "navbar-items"
          }
        >
          <FollowingSvg />
        </NavLink> */}
        <NavLink
          id="connect-container"
          to="/connect"
          className={
            navroute === "connect-container" ? "a-active" : "navbar-items"
          }
        >
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
            <NavLink
              id="profile-container"
              to="/user/profile"
              className={
                navroute === "profile-container" ? "a-active" : "navbar-items"
              }
            >
              {username}
            </NavLink>
            <button
              id="create-post-button"
              onClick={() => {
                navigate("/user/post/create");
              }}
            >
              <CreateSvg />
              <span>Create Posts</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
