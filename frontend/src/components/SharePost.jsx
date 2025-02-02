import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "./PostCard";
import MessagePage from "./MessagePage";
import axios from "axios";

export default function SharePost() {
  const { postID } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/share/post/${postID}`,
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

  return (
    <>
      {post ? (
        <PostCard post={post} />
      ) : (
        <MessagePage message={"Not available"} />
      )}
    </>
  );
}
