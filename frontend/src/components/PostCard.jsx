import { useEffect, useState } from "react";
import "./styles/PostCard.css";
import axios from "axios";

const PostCard = ({ post, user }) => {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchLikedData = async () => {
      const response = await axios.get(
        `http://localhost:3000/post/show/${post._id}`,
        {
          withCredentials: true
        }
      );
      if (response.data.success) {
        if (response.data.data.isLiked) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      }
    };
    fetchLikedData();
  }, []);


  const toggleLiked = async (e) => {
    const response = await axios.get(
      `http://localhost:3000/post/like/toggle/${post._id}`,
      {
        withCredentials: true
      }
    );
    if (response.data.success) {
      if (response.data.data.isLiked) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } else {
      console.log("Failed to proceed");
    }
  };

  return (
    <div className="postcard-container">
      <h2 className="postcard-title">{post.title}</h2>
      <div className="postcard-content-container">
        <p className="postcard-content">{post.content}</p>
      </div>
      <div className="postcard-button-container">
        <button onClick={toggleLiked} className="postcard-button">{isLiked ? "Liked" : "Like"}</button>
      </div>
    </div>
  );
};

export default PostCard;
