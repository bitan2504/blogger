import { useEffect, useState } from "react";

export default function SProfileCard({ user }) {
  const [username, setUsername] = useState("");
  const [avatarLoc, setAvatarLoc] = useState("/default/DEFAULT_AVATAR.jpg");

  useEffect(() => {
    const fetch = async () => {
      try {
        if (user) {
          setUsername(user.username);
        } else {
          setUsername("");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, [user]);

  return (
    <div style={{display: "flex", flexDirection: "row", gap: "0.5rem"}}>
      <img src={avatarLoc} />
      <h2>@{username}</h2>
    </div>
  );
}
