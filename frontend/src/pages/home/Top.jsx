import FetchPosts from "../../components/FetchPosts";
import { useEffect } from "react";

export default function Top({ setNavroute }) {
  useEffect(() => {
    setNavroute("top-container");
  }, []);
  return (
    <div className="home-container">
      <h1 style={{ marginBottom: "1rem", textAlign: "center" }}>Top Posts</h1>
      <FetchPosts uri={`${import.meta.env.VITE_BACKEND_URL}/home/top`} />
    </div>
  );
}
