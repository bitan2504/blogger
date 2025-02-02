import { useEffect } from "react";
import FetchPosts from "../../components/FetchPosts.jsx";
import "./Home.css";

const Home = function ({ setNavroute }) {
  useEffect(() => {
    setNavroute("home-container");
  }, []);

  return (
    <div className="home-container">
      <FetchPosts uri="http://localhost:3000/home" />
    </div>
  );
};

export default Home;
