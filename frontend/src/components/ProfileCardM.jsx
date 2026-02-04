import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ChevronRight, UserPlus, UserCheck } from "lucide-react";

export default function ProfileCardM({
    user,
    active,
    currentUser,
    onFollowStatusChange,
}) {
    const navigate = useNavigate();
    const [avatarLoc, setAvatarLoc] = useState("/default/DEFAULT_AVATAR.jpg");
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        if (user?.isFollowing) {
            setIsFollowing(user.isFollowing);
        }

        if (user?.avatar) {
            setAvatarLoc(user.avatar);
        }
    }, [user]);

    const handleToggleFollow = async () => {
        if (!active) {
            navigate("/login");
            return;
        }

        setFollowLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/connect/follow/toggle/${user.username}`,
                {
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                const newFollowingStatus = !isFollowing;
                setIsFollowing(newFollowingStatus);
                if (onFollowStatusChange) {
                    onFollowStatusChange(user.id, newFollowingStatus);
                }
            }
        } catch (err) {
            console.error("Error toggling follow:", err);
        } finally {
            setFollowLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* User Card */}
            <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0 overflow-hidden">
                    <img
                        src={avatarLoc}
                        alt={user?.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "/default/DEFAULT_AVATAR.jpg";
                        }}
                    />
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">
                        {user?.fullname}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                        @{user?.username}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Link
                    to={`/user/profile/${user?.username}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                    <span>View</span>
                    <ChevronRight size={16} />
                </Link>
                {currentUser?.username !== user?.username && (
                    <button
                        onClick={handleToggleFollow}
                        disabled={followLoading}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            isFollowing
                                ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                        } ${followLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isFollowing ? (
                            <>
                                <UserCheck size={16} />
                                <span>Following</span>
                            </>
                        ) : (
                            <>
                                <UserPlus size={16} />
                                <span>Follow</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
