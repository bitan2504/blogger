import "./styles/Navbar.css";
import { NavLink } from "react-router-dom";

const Navbar = ({ username, setUsername }) => {
  return (
    <nav id="navbar" className="navbar">
      <div className="navbar-container">
        <NavLink to="/home" className="navbar-items" >Home</NavLink>
        <NavLink to="/home/top" className="navbar-items">Top</NavLink>
        <NavLink to="/home/following" className="navbar-items">Following</NavLink>
        <NavLink to="/user/connect" className="navbar-items">Connect</NavLink>
      </div>
      <div className="navbar-container">
        {
          !username ?
            (<><NavLink to="/user/login" className="navbar-items">Login</NavLink>
            <NavLink to="/user/register" className="navbar-items">Register</NavLink></>)
          : (<NavLink to="/user/profile" className="navbar-items">{username}</NavLink>)
        }
      </div>
    </nav>
  );
};

export default Navbar;