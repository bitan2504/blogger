import { useEffect, useState } from "react";
import Redirect from "./Redirect.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Profile.css";

const Profile = ({ user, setUser, posts, setPosts }) => {
  const navigate = useNavigate();
  const [countDown, setCountDown] = useState(5);
  const pageName = "Login";
  const errorMessage = "User not logged in";

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        "http://localhost:3000/user/logout",
        {
          withCredentials: true,
          contentType: "application/json"
        }
      );
      if (res.data.success) {
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowPosts = async (e) => {
      navigate("/user/post/show");
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
          <p>Welcome, {user.username}</p>
          <button onClick={handleShowPosts}>Show Posts</button>
          <form onSubmit={handleLogout}>
            <input type="submit" value="Logout" className="submit-button" />
          </form>
        </>
      ) : (
        <Redirect message={errorMessage} pageName={pageName} countDown={countDown} />
      )}
    </>
  );
};

export default Profile;
