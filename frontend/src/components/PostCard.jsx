import { useEffect, useState } from "react";
import "./PostCard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MConnectCard from "../pages/connect/MConnectCard.jsx";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [author, setAuthor] = useState(null);
  const [shareButtonText, setShareButtonText] = useState("Share");

  useEffect(() => {
    setAuthor(post.author);
    setLikesCount(post.likesCount);
    setIsLiked(post.isLiked);
  }, [post]);

  const toggleLiked = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/post/like/toggle/${post._id}`,
      {
        withCredentials: true,
      }
    );
    if (response.data.success) {
      setIsLiked(response.data.data.isLiked);
      setLikesCount(response.data.data.likesCount);
    } else {
      console.log("Failed to proceed");
    }
  };

  const handleShareButton = async (event) => {
    event.preventDefault();
    await navigator.clipboard
      .writeText(`http://localhost:5173/share/post/${post._id}`)
      .then(() => {
        setShareButtonText("Link copied");
        setTimeout(() => {
          setShareButtonText("Share");
        }, 2000);
      });
  };

  const handleCommentClick = async (event) => {
    event.preventDefault();
    navigate(`/share/post/${post._id}`);
  };

  return (
    <div className="postcard-container">
      <div className="postcard-header">
        <MConnectCard author={author} />
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
          <div>{likesCount}</div>
        </button>
        <button onClick={handleCommentClick}>Comment</button>
        <button className="postcard-button" onClick={handleShareButton}>
          {shareButtonText}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
