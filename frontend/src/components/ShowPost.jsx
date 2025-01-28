import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard.jsx";

function ShowPost({ posts, setPosts, user, setUser }) {
  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await axios.get(
        "http://localhost:3000/user/post/show",
        {
          withCredentials: true
        });
      if (fetchedPosts.data?.success) {
        setPosts(fetchedPosts.data.data);
      } else {
        setPosts(null);
      }
    };
    fetchPosts();
  }, []);
  return (
    <>
      {posts.length > 0 ?
        posts.map(((post, index) => (<PostCard key={index} post={post} user={user} />)))
        :
        <h1>Nothing to show</h1>
      }
    </>);
}

export default ShowPost;