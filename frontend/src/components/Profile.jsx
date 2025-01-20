import { useEffect, useState } from "react";
import Redirect from "./Redirect.jsx";
import { useNavigate } from "react-router-dom";

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [countDown, setCountDown] = useState(5);
  const pageName = "Login";
  const errorMessage = "User not logged in";

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
        </>
      ) : (
        <Redirect message={errorMessage} pageName={pageName} countDown={countDown} />
      )}
    </>
  );
};

export default Profile;
