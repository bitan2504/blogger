import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/ProfileCard.css";
import FetchPosts from "./FetchPosts";

export default function ConnectCard({ user, searchUser }) {
  const [username, setUsername] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [avatarLoc, setAvatarLoc] = useState("/default/DEFAULT_AVATAR.jpg");
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    const fetchConnectUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/connect/${searchUser}`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data.data);

        if (response.data.success) {
          setUsername(response.data.data.username);
          setFollowers(response.data.data.followers.length);
          setFollowing(response.data.data.following.length);
          setFollowed(response.data.data.followed);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchConnectUser();
  }, [searchUser]);

  const handleToggleFollow = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:3000/connect/follow/toggle/${searchUser}`,
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
    <div className="profile-card">
      <div className="profile-card-container">
        <img id="profile-avatar" src={avatarLoc} alt="" />
        <div>
          <h2>@{username}</h2>
          <div className="profile-stats">
            <div>
              <p className="count">{followers}</p>
              <p className="label">Followers</p>
            </div>
            <div>
              <p className="count">{following}</p>
              <p className="label">Following</p>
            </div>
          </div>
        </div>
        <button onClick={handleToggleFollow}>
          {followed ? "Following" : "Follow"}
        </button>
      </div>
      <div>
        {/* <div className="post-header">Posts</div> */}
        <FetchPosts
          user={user}
          uri={`http://localhost:3000/connect/${searchUser}/posts`}
        />
      </div>
    </div>
  );
}
