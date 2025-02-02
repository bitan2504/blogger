import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import ProfileCard from "./ProfileCard.jsx";
import MessagePage from "../../components/MessagePage.jsx";
import { useEffect } from "react";

const Profile = ({ active, setActive, setNavroute }) => {
  useEffect(() => {
    setNavroute("profile-container");
  }, []);

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("http://localhost:3000/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        setActive(null);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {active ? (
        <>
          <ProfileCard uri="http://localhost:3000/user/profile" />
          <form onSubmit={handleLogout}>
            <input type="submit" value="Logout" className="submit-button" />
          </form>
        </>
      ) : (
        <MessagePage message={"User not logged in"} />
      )}
    </>
  );
};

export default Profile;
