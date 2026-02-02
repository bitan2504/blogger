import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCardM from "../../components/PostCardM.jsx";
import MessagePage from "../../components/MessagePage.jsx";
import axios from "axios";
import FetchComment from "../../components/FetchComment.jsx";

export default function SharePost() {
  const { postID } = useParams();
  const [post, setPost] = useState({});
  const [commentContent, setCommentContent] = useState("");
  const [postAvailable, setPostAvailable] = useState(true);
  const [refreshBit, setRefreshBit] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/share/post/${postID}`,
          {
            withCredentials: true,
          }
        );
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    fetchPosts().then((response) => {
      if (response?.success) {
        setPostAvailable(!!response.data);
        setPost(response.data);
        setCommentContent(response.data.comments);
      } else {
        setPostAvailable(false);
        setPost(null);
        setCommentContent(null);
      }
    });
  }, [postID]);

  const handleCommentInput = (event) => {
    event.preventDefault();
    setCommentContent(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(post);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/share/comments/post/${postID}`,
        {
          content: commentContent,
        },
        {
          withCredentials: true,
        }
      );
      setRefreshBit(response.data.success);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!postAvailable ? (
        <MessagePage message={"Post not available"} />
      ) : !post ? (
        <MessagePage message={"Loading..."} />
      ) : (
        <div className="full-post-container">
          <PostCardM post={post} />
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
          <FetchComment
            postId={postID}
            refreshBit={refreshBit}
            setRefreshBit={setRefreshBit}
          />
        </div>
      )}
    </>
  );
}
