import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MessagePage from "../../components/MessagePage.jsx";
import { useEffect, useState } from "react";
import PostCardM from "../../components/PostCardM.jsx";
import {
    User,
    LogOut,
    Users,
    Calendar,
    Mail,
    Edit2,
    Camera,
    ChevronRight,
    FileText,
    Heart,
} from "lucide-react";

const Profile = ({ active, setActive, setNavroute }) => {
    useEffect(() => {
        setNavroute("profile-container");
    }, []);

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [avatarLoc, setAvatarLoc] = useState("/default/DEFAULT_AVATAR.jpg");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/user/profile?includePosts=true`,
                    {
                        withCredentials: true,
                    }
                );

                if (response.data.success) {
                    setUser(response.data.data.user);
                    setPosts(response.data.data.posts || []);

                    if (response.data.data?.user?.avatar) {
                        setAvatarLoc(response.data.data.user.avatar);
                    }
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/user/logout`,
                {
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                setActive(null);
                navigate("/");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!active) {
        return <MessagePage message={"User not logged in"} />;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-gray-200"></div>
                                <div className="space-y-3">
                                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
                    {/* Cover */}
                    <div className="h-20 lg:h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                    {/* Profile Info */}
                    <div className="relative px-6 py-4">
                        {/* Avatar */}
                        <div className="absolute -top-8 lg:-top-10 left-6">
                            <div className="relative">
                                <div className="w-20 lg:w-24 h-20 lg:h-24 rounded-full border-4 border-white bg-gradient-to-r from-blue-400 to-indigo-500 overflow-hidden shadow-xl">
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
                                <button className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Camera
                                        size={14}
                                        className="text-gray-700"
                                    />
                                </button>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="pt-12 lg:pt-14">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                                            @{user?.username}
                                        </h1>
                                    </div>

                                    <div className="flex flex-wrap gap-3 text-xs lg:text-sm text-gray-500">
                                        {user?.email && (
                                            <div className="flex items-center gap-1">
                                                <Mail size={12} />
                                                <span>{user.email}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            <span>
                                                Joined{" "}
                                                {new Date(
                                                    user?.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 lg:gap-8 mb-4">
                                <div className="text-center">
                                    <div className="text-lg lg:text-2xl font-bold text-gray-900">
                                        {user?.followers || 0}
                                    </div>
                                    <div className="text-xs lg:text-sm text-gray-500 flex items-center gap-1 justify-center">
                                        <Users size={12} />
                                        Followers
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg lg:text-2xl font-bold text-gray-900">
                                        {user?.following || 0}
                                    </div>
                                    <div className="text-xs lg:text-sm text-gray-500 flex items-center gap-1 justify-center">
                                        <User size={12} />
                                        Following
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg lg:text-2xl font-bold text-gray-900">
                                        {posts.length}
                                    </div>
                                    <div className="text-xs lg:text-sm text-gray-500 flex items-center gap-1 justify-center">
                                        <FileText size={12} />
                                        Posts
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg lg:text-2xl font-bold text-gray-900">
                                        {user?.likesCount || 0}
                                    </div>
                                    <div className="text-xs lg:text-sm text-gray-500 flex items-center gap-1 justify-center">
                                        <Heart size={12} />
                                        Total Likes
                                    </div>
                                </div>
                            </div>

                            {/* Profile Actions */}
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm lg:text-base font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all">
                                    <Edit2 size={16} />
                                    Edit Profile
                                </button>
                                <form
                                    onSubmit={handleLogout}
                                    className="inline-block"
                                >
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 text-sm lg:text-base font-medium rounded-xl hover:bg-red-50 hover:border-red-300 transition-all"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Your Posts
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Posts Grid */}
                    {posts.length > 0 ? (
                        <div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {posts.map((post) => (
                                    <PostCardM
                                        key={post._id}
                                        post={{ ...post, author: user }}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-center mt-8">
                                <Link 
                                    to="/user/posts"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
                                >
                                    View More Posts
                                    <ChevronRight size={18} />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                                <FileText size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                No posts yet
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Start sharing your thoughts and ideas with the
                                community. Your first post could inspire others!
                            </p>
                            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                                <FileText size={16} />
                                Create Your First Post
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
