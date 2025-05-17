import { useState, useEffect } from "react";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import ConnectSvg from "../../public/img/ConnectSvg.jsx";
import FollowingSvg from "../../public/img/FollowingSvg.jsx";
import TopSvg from "../../public/img/TopSvg.jsx";
import HomeSvg from "../../public/img/HomeSvg.jsx";
import CreateSvg from "../../public/img/CreateSvg.jsx";

export default function Navbar({ active, user, navroute }) {
  const [username, setUsername] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(user?.username);
  }, [user]);

  return (
    <nav id="navbar" className="navbar">
      <div className="logo-hamburger-row">
        <img id="logo" src="/img/navbar.png" alt="Logo" />
        <button
          id="hamburger-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={menuOpen}
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>
      </div>

      <div className={`navbar-container ${menuOpen ? "show" : ""}`}>
        <NavLink
          id="home-container"
          to="/home"
          className={navroute === "home-container" ? "a-active" : "navbar-items"}
          onClick={() => setMenuOpen(false)}
        >
          <HomeSvg />
        </NavLink>
        <NavLink
          id="top-container"
          to="/home/top"
          className={navroute === "top-container" ? "a-active" : "navbar-items"}
          onClick={() => setMenuOpen(false)}
        >
          <TopSvg />
        </NavLink>
        <NavLink
          id="connect-container"
          to="/connect"
          className={navroute === "connect-container" ? "a-active" : "navbar-items"}
          onClick={() => setMenuOpen(false)}
        >
          <ConnectSvg />
        </NavLink>

        {!active ? (
          <>
            <NavLink
              to="/user/login"
              className="navbar-items"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>
            <NavLink
              to="/user/register"
              className="navbar-items"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              id="profile-container"
              to="/user/profile"
              className={navroute === "profile-container" ? "a-active" : "navbar-items"}
              onClick={() => setMenuOpen(false)}
            >
              {username}
            </NavLink>
            <button
              id="create-post-button"
              onClick={() => {
                navigate("/user/post/create");
                setMenuOpen(false);
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
