import { useEffect, useState } from "react";
import ConnectCard from "./ConnectCard.jsx";

export default function Connect({ user }) {
  const [search, setSearch] = useState("");
  const [searchUser, setSearchUser] = useState("");

  const handleSearchChange = (event) => {
    event.preventDefault();
    setSearch(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchUser(search);
  };

  return (
    <>
      {/* <form
        
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "1rem",
        }}
      > */}
      <input
        type="text"
        onChange={handleSearchChange}
        value={search}
        style={{ width: "20rem" }}
        placeholder="Search User"
      />
      <button onClick={handleSearch}>Go</button>
      {/* </form> */}
      {searchUser ? (
        <ConnectCard
          user={user}
          searchUser={searchUser}
        />
      ) : (
        <></>
      )}
    </>
  );
}
