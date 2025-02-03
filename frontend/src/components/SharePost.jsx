import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "./PostCard";
import MessagePage from "./MessagePage";
import axios from "axios";
import "./SharePost.css";
import FetchComment from "./FetchComment.jsx";

export default function SharePost() {
  const navigate = useNavigate();
  const { postID } = useParams();
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/share/post/${postID}`,
          {
            withCredentials: true,
          }
        );

        if (response.data?.success) {
          setPost(response.data.data);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, [postID]);

  const handleCommentInput = (event) => {
    event.preventDefault();
    setCommentContent(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/share/comments/post/${post._id}`,
        {
          content: commentContent,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {post ? (
        <div className="full-post-container">
          <PostCard post={post} />
          <h2>Comments</h2>
          <form className="add-comment-form" onSubmit={handleCommentSubmit}>
            <input
              type="text"
              placeholder="Add comments"
              value={commentContent}
              onChange={handleCommentInput}
            />
            <button type="submit">Go</button>
          </form>
          <FetchComment postId={post._id} />
        </div>
      ) : (
        <MessagePage message={"Not available"} />
      )}
    </>
  );
}
