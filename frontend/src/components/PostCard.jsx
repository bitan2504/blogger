import { useEffect, useState } from "react";
import "./PostCard.css";
import axios from "axios";
import MProfileCard from "../pages/connect/MConnectCard.jsx";

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [author, setAuthor] = useState("");
  const [shareButtonText, setShareButtonText] = useState("Share");

  useEffect(() => {
    const fetchAuthorData = async (authorId) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/connect/id/${authorId}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setAuthor(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchLikedData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/post/show/${post._id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setIsLiked(response.data.data.isLiked);
        setLikes(response.data.data.likes);
        fetchAuthorData(post.author);
      }
    };
    fetchLikedData();
  }, []);

  const toggleLiked = async (e) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/post/like/toggle/${post._id}`,
      {
        withCredentials: true,
      }
    );
    if (response.data.success) {
      setIsLiked(response.data.data.isLiked);
      setLikes(response.data.data.likes);
    } else {
      console.log("Failed to proceed");
    }
  };

  const handleShareButton = async (event) => {
    event.preventDefault();
    await navigator.clipboard
      .writeText(`http://localhost:5173/share/post/${post._id}`)
      .then(() => {
        setShareButtonText("Text copied");
        setTimeout(() => {
          setShareButtonText("Share");
        }, 2000);
      });
  };

  return (
    <div className="postcard-container">
      <div className="postcard-header">
        <MProfileCard author={author} />
        <h2 className="postcard-title">{post.title}</h2>
      </div>
      <div className="postcard-content-container">
        <p className="postcard-content">{post.content}</p>
      </div>
      <div className="postcard-button-container">
        <button
          onClick={toggleLiked}
          className={isLiked ? "liked-button" : "like-button"}
        >
          <div>{isLiked ? "Liked" : "Like"}</div>
          <div>{likes}</div>
        </button>
        <button className="postcard-button" onClick={handleShareButton}>
          {shareButtonText}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
