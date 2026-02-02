import { useEffect, useState } from "react";
import axios from "axios";
import PostCardM from "./PostCardM.jsx";
import FetchPosts from "./FetchPosts.jsx";

function ShowPost({ user }) {
  return (
    <>
      <FetchPosts user={user} uri={`${import.meta.env.VITE_BACKEND_URL}/user/post/show`} />
    </>
  );
}

export default ShowPost;
