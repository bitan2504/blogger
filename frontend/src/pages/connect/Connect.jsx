import { useEffect, useState } from "react";
import ConnectCard from "./ConnectCard.jsx";
import "../profile/Profile.css";

export default function Connect({ active, setNavroute }) {
  useEffect(() => {
    setNavroute("connect-container");
  }, []);

  const [search, setSearch] = useState("");
  const [searchUser, setSearchUser] = useState("");

  const handleSearchChange = (event) => {
    event.preventDefault();
    setSearch(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchUser(search);
    console.log(search);
  };

  return (
    <>
      <h1 style={{ marginBottom: "1rem", textAlign: "center" }}>
        Connect with people
      </h1>
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          onChange={handleSearchChange}
          value={search}
          style={{ width: "20rem" }}
          placeholder="Search User"
        />
        <button type="submit">Go</button>
      </form>
      {searchUser ? (
        <ConnectCard active={active} searchUser={searchUser} />
      ) : (
        <></>
      )}
    </>
  );
}
