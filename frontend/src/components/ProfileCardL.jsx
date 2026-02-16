import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import PostCardM from "./PostCardM.jsx";
import {
    User,
    Users,
    Calendar,
    Mail,
    ChevronRight,
    FileText,
    Heart,
    Settings,
    Share2,
    Bookmark,
    Bell,
    UserPlus,
    UserCheck,
} from "lucide-react";

const ProfileCardL = ({ currentUser, user, posts }) => {
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
        if (!user) {
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
                setIsFollowing(!isFollowing);
            }
        } catch (err) {
            console.error("Error toggling follow:", err);
        } finally {
            setFollowLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Profile Header */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                            {/* Cover */}
                            <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-700"></div>

                            {/* Profile Info */}
                            <div className="relative px-8 py-6">
                                {/* Avatar */}
                                <div className="absolute -top-16 left-8">
                                    <div className="relative">
                                        <div className="w-32 h-32 rounded-xl border-4 border-white bg-blue-600 overflow-hidden shadow-md">
                                            <img
                                                src={avatarLoc}
                                                alt={user?.username}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src =
                                                        "/default/DEFAULT_AVATAR.jpg";
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="pt-20">
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h1 className="text-3xl font-bold text-gray-900">
                                                @{user?.username}
                                            </h1>
                                            {user &&
                                                currentUser?.username !==
                                                    user.username && (
                                                    <button
                                                        onClick={
                                                            handleToggleFollow
                                                        }
                                                        disabled={followLoading}
                                                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                                                            isFollowing
                                                                ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                                        } ${followLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                                    >
                                                        {isFollowing ? (
                                                            <>
                                                                <UserCheck
                                                                    size={18}
                                                                />
                                                                Following
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserPlus
                                                                    size={18}
                                                                />
                                                                Follow
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            {user?.email && (
                                                <div className="flex items-center gap-2">
                                                    <Mail
                                                        size={16}
                                                        className="text-blue-600"
                                                    />
                                                    <span>{user.email}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Calendar
                                                    size={16}
                                                    className="text-gray-500"
                                                />
                                                <span>
                                                    Joined{" "}
                                                    {new Date(
                                                        user?.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-4 gap-4 mb-6 py-6 border-t border-b border-gray-200">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {user?.followers || 0}
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-center gap-1 justify-center mt-1">
                                                <Users size={14} />
                                                Followers
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {user?.following || 0}
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-center gap-1 justify-center mt-1">
                                                <User size={14} />
                                                Following
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {posts.length}
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-center gap-1 justify-center mt-1">
                                                <FileText size={14} />
                                                Posts
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {user?.likesCount || 0}
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-center gap-1 justify-center mt-1">
                                                <Heart size={14} />
                                                Likes
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Posts Section */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-blue-600 text-white">
                                    <FileText size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    User Posts
                                </h2>
                            </div>

                            {/* Posts Grid */}
                            {posts.length > 0 ? (
                                <div>
                                    <div className="grid grid-cols-1 gap-6 mb-8">
                                        {posts.map((post) => (
                                            <PostCardM
                                                key={post._id}
                                                post={{ ...post, author: user }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-center">
                                        <Link
                                            to={`/user/posts?username=${user.username}`}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            View More Posts
                                            <ChevronRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center">
                                        <FileText
                                            size={32}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        No posts yet
                                    </h3>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                        Start sharing your thoughts and ideas
                                        with the community. Your first post
                                        could inspire others!
                                    </p>
                                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                                        <FileText size={18} />
                                        Create Your First Post
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Quick Links */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Quick Links
                                </h3>
                                <div className="space-y-2">
                                    <Link
                                        to="/home/top"
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 group"
                                    >
                                        <span className="flex items-center gap-3 font-medium">
                                            <FileText
                                                size={18}
                                                className="text-blue-600"
                                            />
                                            Trending Posts
                                        </span>
                                        <ChevronRight
                                            size={16}
                                            className="text-gray-400 group-hover:translate-x-1 transition-transform"
                                        />
                                    </Link>

                                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 group">
                                        <span className="flex items-center gap-3 font-medium">
                                            <Bookmark
                                                size={18}
                                                className="text-green-600"
                                            />
                                            Saved Posts
                                        </span>
                                        <ChevronRight
                                            size={16}
                                            className="text-gray-400 group-hover:translate-x-1 transition-transform"
                                        />
                                    </button>

                                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 group">
                                        <span className="flex items-center gap-3 font-medium">
                                            <Bell
                                                size={18}
                                                className="text-orange-600"
                                            />
                                            Notifications
                                        </span>
                                        <ChevronRight
                                            size={16}
                                            className="text-gray-400 group-hover:translate-x-1 transition-transform"
                                        />
                                    </button>

                                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 group">
                                        <span className="flex items-center gap-3 font-medium">
                                            <Share2
                                                size={18}
                                                className="text-purple-600"
                                            />
                                            Share Profile
                                        </span>
                                        <ChevronRight
                                            size={16}
                                            className="text-gray-400 group-hover:translate-x-1 transition-transform"
                                        />
                                    </button>

                                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 group">
                                        <span className="flex items-center gap-3 font-medium">
                                            <Settings
                                                size={18}
                                                className="text-gray-600"
                                            />
                                            Settings
                                        </span>
                                        <ChevronRight
                                            size={16}
                                            className="text-gray-400 group-hover:translate-x-1 transition-transform"
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Profile Stats Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Profile Stats
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <span className="font-medium text-gray-700">
                                            Likes
                                        </span>
                                        <span className="text-lg font-bold text-gray-900">
                                            {user?.likesCount || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <span className="font-medium text-gray-700">
                                            Comments
                                        </span>
                                        <span className="text-lg font-bold text-gray-900">
                                            0
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCardL;
