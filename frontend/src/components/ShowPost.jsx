import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard.jsx";
import FetchPosts from "./FetchPosts.jsx";

function ShowPost({ user }) {
  return (
    <>
      <FetchPosts user={user} uri="http://localhost:3000/user/post/show" />
    </>
  );
}

export default ShowPost;
