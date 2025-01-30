import axios from "axios";
import { useEffect } from "react";
import FetchPosts from "./FetchPosts";

export default function Top({ user }) {
  return (
    <>
      <h1>Top</h1>
      <FetchPosts user={user} uri="http://localhost:3000/home/top" />
    </>
  );
}
