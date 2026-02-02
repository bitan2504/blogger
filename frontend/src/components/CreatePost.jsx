import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MessagePage from "./MessagePage.jsx";

const CreatePost = ({ active }) => {
  const textAreaRef = useRef();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

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
          `${import.meta.env.VITE_BACKEND_URL}/user/post/create`,
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

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
  }, [formData]);

  return (
    <>
      {!active ? (
        <MessagePage message={"User not logged in"} />
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
              Create Post
            </h1>
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
              ref={textAreaRef}
              type="text"
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
      )}
    </>
  );
};

export default CreatePost;
