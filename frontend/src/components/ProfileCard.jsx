import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/ProfileCard.css";
import FetchPosts from "./FetchPosts";

export default function ProfileCard({ user, uri }) {
  const [username, setUsername] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [avatarLoc, setAvatarLoc] = useState("/default/DEFAULT_AVATAR.jpg");

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(uri, {
          withCredentials: true,
        });
        console.log(response.data.data);

        if (response.data.success) {
          setUsername(response.data.data.username);
          setFollowers(response.data.data.followers);
          setFollowing(response.data.data.following);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, []);

  return (
    <div className="profile-card">
      <img id="profile-avatar" src={avatarLoc} alt="" />
      <h2>@{username}</h2>
      {/* <div className="profile-stats">
        <div>
          <p className="count">{followers}</p>
          <p className="label">Followers</p>
        </div>
        <div>
          <p className="count">{following}</p>
          <p className="label">Following</p>
        </div>
      </div> */}
      <div>
        {/* <div className="post-header">Posts</div> */}
        <FetchPosts user={user} uri={`${uri}/posts`} />
      </div>
    </div>
  );
}
