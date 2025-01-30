import { useEffect, useState } from "react";
import Redirect from "./Redirect.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Profile.css";
import ProfileCard from "./ProfileCard.jsx";

const Profile = ({ user, setUser, posts, setPosts }) => {
  const navigate = useNavigate();
  const [countDown, setCountDown] = useState(5);
  const pageName = "Login";
  const errorMessage = "User not logged in";
  console.log(user);
  

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("http://localhost:3000/user/logout", {
        withCredentials: true,
        contentType: "application/json",
      });
      if (res.data.success) {
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000);
      if (countDown <= 0) {
        navigate("/user/login");
      }
    }
  }, [countDown]);

  return (
    <>
      {user ? (
        <>
          <h1>Profile</h1>
          <ProfileCard  user={user} uri="http://localhost:3000/user/profile" />
          <form onSubmit={handleLogout}>
            <input type="submit" value="Logout" className="submit-button" />
          </form>
        </>
      ) : (
        <Redirect
          message={errorMessage}
          pageName={pageName}
          countDown={countDown}
        />
      )}
    </>
  );
};

export default Profile;
