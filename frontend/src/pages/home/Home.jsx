import { useEffect } from "react";
import FetchPosts from "../../components/FetchPosts.jsx";

const Home = function ({ setNavroute }) {
  useEffect(() => {
    setNavroute("home-container");
  }, []);
  
  return (
    <>
      <FetchPosts uri="http://localhost:3000/home" />
    </>
  );
};

export default Home;
