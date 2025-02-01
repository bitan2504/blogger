import FetchPosts from "../../components/FetchPosts.jsx";

const Home = function () {
  return (
    <>
      <FetchPosts uri="http://localhost:3000/home" />
    </>
  );
};

export default Home;
