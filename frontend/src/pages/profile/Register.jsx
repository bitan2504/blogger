import React, { useEffect, useState } from "react";
import "./Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MessagePage from "../../components/MessagePage";

const Register = ({ user, setNavroute }) => {
  useEffect(() => {
    setNavroute("home-container");
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    avatar: null,
  });
  const navigate = useNavigate();
  const [countDown, setCountDown] = useState(5);
  const pageName = "Profile";
  const errorMessage = "User already logged in";

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000);
      if (countDown <= 0) {
        navigate("/user/profile");
        return;
      }
    }
  }, [countDown, user]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.fullname) newErrors.fullname = "Fullname is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm your password.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.dob) newErrors.dob = "Date of birth is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/user/register`,
          formData,
          {
            withCredentials: true,
            contentType: "application/json",
          }
        );

        if (response.data.success) {
          navigate("/user/login");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {user ? (
        <MessagePage message={"User is logged in"} />
      ) : (
        // <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <h2>Register</h2>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
              />
              {errors.username && (
                <span className="error">{errors.username}</span>
              )}
            </div>

            <div className="form-group">
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Fullname"
              />
              {errors.fullname && (
                <span className="error">{errors.fullname}</span>
              )}
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="form-group">
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="Date of Birth"
              />
              {errors.dob && <span className="error">{errors.dob}</span>}
            </div>

            {/* <div id="avatar-form-group">
              <label htmlFor="avatar">Avatar</label>
              <input type="file" name="avatar" onChange={handleChange} />
            </div> */}

            <button className="submit-button" type="submit">
              Submit
            </button>
          </form>
        // </div>
      )}
    </>
  );
};

export default Register;
