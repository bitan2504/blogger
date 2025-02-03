import axios from "axios";
import { useEffect, useState } from "react";
import "./ConnectCard.css";

export default function MProfileCard({ author }) {
  const [username, setUsername] = useState("");
  const [avatarLoc, setAvatarLoc] = useState("/default/DEFAULT_AVATAR.jpg");
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (author) {
      setUsername(author.username);
      setFollowed(author.followed);
    } else {
      setUsername("");
      setFollowed(false);
    }
  }, [author]);

  const handleToggleFollow = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/connect/follow/toggle/${author.username}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setFollowed(response.data.data.followed);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <img src={avatarLoc} style={{width: "2rem", height: "2rem", borderRadius: "50%"}} />
        <h2>{username}</h2>
      </div>
      <button
        className={followed ? "followed-button" : "follow-button"}
        onClick={handleToggleFollow}
      >
        {followed ? "Following" : "Follow"}
      </button>
    </div>
  );
}
