import { useEffect, useState } from "react";
import axios from "axios";
import CommentCard from "../pages/connect/CommentCard";
import MessagePage from "./MessagePage.jsx"

export default function FetchComment({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    console.log(postId);
    
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/share/comments/${postId}`
        );

        if (response.data?.success) {
          setComments(response.data.data);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchComments();
  }, [postId]);

  return (
    <>
      {comments.length > 0 ? (
        <>
          {comments.map((comment, index) => (
            <CommentCard key={index} comment={comment} />
          ))}
        </>
      ) : (
        <MessagePage message={"No comments to show"} />
      )}
    </>
  );
}
