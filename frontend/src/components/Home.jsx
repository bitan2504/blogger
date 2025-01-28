import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard.jsx";

const Home = function({ user }) {
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPosts, setCurrentPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumberInput, setPageNumberInput] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/home/${page}`,
          {
            withCredentials: true
          }
        );
        console.log(response.data);
        if (response.data?.success) {
          setCurrentPosts(response.data.data);
        } else {
          setCurrentPosts([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, [page]);

  useEffect(() => {
    const fetchNumberOfPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/home/total_posts");
        if (response.data?.success) {
          setTotalPosts(response.data.data);
        } else {
          setTotalPosts(0);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchNumberOfPosts();
  }, []);

  useEffect(() => {
    setTotalPages(Math.max(totalPosts / 5, 1));
  }, [totalPosts]);

  const handlePageChange = (event) => {
    event.preventDefault();
    setPageNumberInput(event.target.value);
    if (event.type === "onClick")
      setPage(event.target.value);
  }
  const handlePage = (event) => {
    event.preventDefault();
    setPage(pageNumberInput);
  }

  return (
    <>
      <h1>Home Page</h1>
      <form onSubmit={handlePage}>
          <input type="number" onChange={handlePageChange} value={pageNumberInput} />
          <input type="submit" value="Go" />
      </form>
      <>
        {currentPosts.length > 0 ?
          currentPosts.map(((post, index) => (<PostCard key={index} post={post} user={user} />)))
          :
          <h1>Nothing to show</h1>
        }
      </>
    </>
  );
};

export default Home;