import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MessagePage from "../../components/MessagePage.jsx";

export default function Login({ active, setActive, setNavroute }) {
  useEffect(() => {
    setNavroute("home-container");
  }, []);

  const [formData, setFormData] = useState({
    uid: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.uid) newErrors.uid = "Username or Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/user/login`,
          formData,
          {
            withCredentials: true,
            contentType: "application/json",
          }
        );
        if (response.data.success) {
          setActive(true);
          navigate("/home");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {active ? (
        <MessagePage message={"User is logged in."} />
      ) : (
        // <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <h2>Login</h2>
              <input
                type="text"
                name="uid"
                value={formData.uid}
                onChange={handleChange}
                placeholder="Username or Email"
              />
              {errors.uid && <span className="error">{errors.uid}</span>}
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

            <div className="form-group forgot-password">
              <Link to="/user/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button className="submit-button" type="submit">
              Login
            </button>
          </form>
        // </div>
      )}
    </>
  );
}
