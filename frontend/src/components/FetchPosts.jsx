import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard.jsx";
import MessagePage from "./MessagePage.jsx";

const FetchPosts = function ({ uri }) {
  const [currentPosts, setCurrentPosts] = useState(null);
  const [page, setPage] = useState(1);
  const [pageNumberInput, setPageNumberInput] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${uri}/${page}`, {
          withCredentials: true,
        });

        console.log(response.data.data);
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
      {currentPosts ? (
        currentPosts.length > 0 ? (
          <>
            {currentPosts.map((post, index) => (
              <PostCard key={index} post={post} />
            ))}
            <form
              onSubmit={handlePage}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <label htmlFor="page-number">Page</label>
              <input
                id="page-number"
                type="number"
                onChange={handlePageChange}
                value={pageNumberInput}
                style={{ width: "20rem" }}
              />
              <button type="submit">Go</button>
            </form>
          </>
        ) : (
          <MessagePage message="No posts to show" />
        )
      ) : (
        <MessagePage message="Loading..." />
      )}
    </>
  );
};

export default FetchPosts;
