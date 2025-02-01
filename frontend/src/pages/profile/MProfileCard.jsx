import { useEffect, useState } from "react";
import "./ProfileCard.css";

export default function MProfileCard({ user }) {
  const [username, setUsername] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [avatarLoc, setAvatarLoc] = useState("/default/DEFAULT_AVATAR.jpg");

  useEffect(() => {
    const fetch = async () => {
      try {
        if (user) {
          setUsername(user.username);
          setFollowers(user.followers.length);
          setFollowing(user.following.length);
        } else {
          setUsername("");
          setFollowers(0);
          setFollowing(0);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, [user]);

  return (
    <div className="profile-card">
      {user ? (
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
        </div>
      ) : (
        <h3>Please log in first.</h3>
      )}
    </div>
  );
}
