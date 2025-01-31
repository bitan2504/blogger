import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard.jsx";

const FetchPosts = function ({ user, uri }) {
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPosts, setCurrentPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageNumberInput, setPageNumberInput] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${uri}/${page}`, {
          withCredentials: true,
        });
        
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
  }, [page, uri]);

  const handlePageChange = (event) => {
    event.preventDefault();
    setPageNumberInput(event.target.value);
  };

  const handlePage = (event) => {
    event.preventDefault();
    setPage(pageNumberInput);
  };

  return (
    <>
      <form
        onSubmit={handlePage}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <input
          type="number"
          onChange={handlePageChange}
          value={pageNumberInput}
          style={{ width: "20rem" }}
        />
        <input type="submit" value="Go" />
      </form>
      <>
        {currentPosts.length > 0 ? (
          currentPosts.map((post, index) => (
            <PostCard key={index} post={post} user={user} />
          ))
        ) : (
          <h1>Nothing to show</h1>
        )}
      </>
    </>
  );
};

export default FetchPosts;
