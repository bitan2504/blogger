import React, { useEffect, useState } from "react";
import "./styles/CreatePost.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Redirect from "./Redirect.jsx";

const CreatePost = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const navigate = useNavigate();
  const [countDown, setCountDown] = useState(5);
  const pageName = "Login";
  const errorMessage = "Please login first.";

  useEffect(() => {
    if (!user) {
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.content) newErrors.content = "Content is empty.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:3000/user/post/create",
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {!user ? (
        <Redirect
          message={errorMessage}
          pageName={pageName}
          countDown={countDown}
        />
      ) : (
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <h2>Create Post</h2>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
              />
              {errors.title && <span className="error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Content"
              ></textarea>
              {errors.content && (
                <span className="error">{errors.content}</span>
              )}
            </div>
            <button className="submit-button" type="submit">
              Post
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CreatePost;
