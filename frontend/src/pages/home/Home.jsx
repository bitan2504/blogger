import FetchPosts from "../../components/FetchPosts.jsx";

const Home = function () {
  return (
    <>
      <h1>Home Page</h1>
      <FetchPosts uri="http://localhost:3000/home" />
    </>
  );
};

export default Home;
