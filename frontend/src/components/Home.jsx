import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard.jsx";
import FetchPosts from "./FetchPosts.jsx";

const Home = function ({ user }) {
  return (
    <>
      <h1>Home Page</h1>
      <FetchPosts user={user} uri="http://localhost:3000/home" />
    </>
  );
};

export default Home;
