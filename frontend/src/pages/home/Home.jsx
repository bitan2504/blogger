import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import {
    Flame,
    Clock,
    TrendingUp,
    Users,
    ChevronRight,
    Filter,
    Search,
    Sparkles,
    Plus,
} from "lucide-react";
import axios from "axios";
import PostCardM from "../../components/PostCardM";
import PostCardS from "../../components/PostCardS";
import { UserContext } from "../../context/UserContext";

const Home = ({ setNavroute }) => {
    const { active } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef(null);

    useEffect(() => {
        setNavroute("home-container");
        fetchPosts();
        fetchTrending();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [activeFilter]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/post?orderBy=${activeFilter}`,
                { withCredentials: true }
            );
            setPosts(response.data.data || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrending = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/post?orderBy=likes`,
                { withCredentials: true }
            );
            setTrending(response.data.data || []);
        } catch (error) {
            console.error("Error fetching trending:", error);
        }
    };

    const filters = [
        { id: "", label: "All Posts" },
        { id: "following", label: "Following", disabled: !active },
        { id: "likes", label: "Popular" },
        { id: "date", label: "Recent" },
    ];

    const categories = [
        { name: "Technology", color: "bg-blue-100 text-blue-700" },
        { name: "Design", color: "bg-purple-100 text-purple-700" },
        { name: "Business", color: "bg-emerald-100 text-emerald-700" },
        { name: "Lifestyle", color: "bg-pink-100 text-pink-700" },
        { name: "Education", color: "bg-amber-100 text-amber-700" },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-12 bg-gray-200 rounded-lg w-96 mb-4 mx-auto"></div>
                        <div className="h-6 bg-gray-200 rounded w-64 mb-12 mx-auto"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                                    >
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-6"></div>
                                        <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                                        <div className="flex justify-between">
                                            <div className="h-5 bg-gray-200 rounded w-32"></div>
                                            <div className="h-5 bg-gray-200 rounded w-40"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-gray-50 pt-20 pb-20 px-4"
            ref={containerRef}
        >
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg mb-6">
                        <Sparkles size={20} />
                        <span className="text-sm font-semibold">
                            Welcome to blogger
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                        Discover Amazing Content
                        <span className="block mt-2 text-blue-600">
                            From Creative Minds
                        </span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                        Join thousands of creators sharing their ideas,
                        insights, and stories. Connect, learn, and grow together
                        in a vibrant community.
                    </p>

                    {/* Search Bar */}
                    {/* <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <div className="bg-white rounded-lg border border-gray-300 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                <Search
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    placeholder="Search for topics, creators, or keywords..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-12 pr-4 py-3 bg-transparent rounded-lg focus:outline-none text-gray-900 placeholder-gray-500"
                                />
                            </div>
                        </div>
                    </div> */}

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {categories.map((category) => (
                            <button
                                key={category.name}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${category.color}`}
                            >
                                #{category.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Filter Tabs */}
                        <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-2 border border-gray-200">
                            <div className="flex items-center gap-1 overflow-x-auto flex-1">
                                {filters.map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() =>
                                            setActiveFilter(filter.id)
                                        }
                                        disabled={filter.disabled}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                                            activeFilter === filter.id
                                                ? "bg-blue-600 text-white"
                                                : filter.disabled
                                                  ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                                                  : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        {filter.id === "likes" && (
                                            <TrendingUp size={16} />
                                        )}
                                        {filter.id === "date" && (
                                            <Clock size={16} />
                                        )}
                                        {filter.id === "following" && (
                                            <Users size={16} />
                                        )}
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Posts Grid */}
                        <div className="space-y-6">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostCardM key={post.id} post={post} />
                                ))
                            ) : (
                                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Flame
                                            size={28}
                                            className="text-blue-600"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        No posts yet
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Be the first to share something amazing!
                                    </p>
                                    {active && (
                                        <Link
                                            to="/user/post/create"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Plus size={18} />
                                            Create Your First Post
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Trending Section */}
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-600 text-white">
                                            <Flame size={20} />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Trending Now
                                        </h2>
                                    </div>
                                    <TrendingUp
                                        size={20}
                                        className="text-blue-600"
                                    />
                                </div>

                                <div className="space-y-3">
                                    {trending.length > 0 ? (
                                        trending
                                            .slice(0, 5)
                                            .map((item, index) => (
                                                <PostCardS
                                                    key={item.id}
                                                    post={item}
                                                    index={index}
                                                />
                                            ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">
                                                No trending posts yet
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    to="/home/top"
                                    className="mt-6 flex items-center justify-center gap-2 w-full py-3 text-blue-600 hover:text-blue-700 font-semibold bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    View All Trending
                                    <ChevronRight size={16} />
                                </Link>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Quick Actions
                                </h3>
                                <div className="space-y-2">
                                    {active && (
                                        <Link
                                            to="/user/post/create"
                                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Plus
                                                    size={18}
                                                    className="text-blue-600"
                                                />
                                                <span className="font-medium text-gray-700">
                                                    Create Post
                                                </span>
                                            </div>
                                            <ChevronRight
                                                size={16}
                                                className="text-gray-400 group-hover:translate-x-1 transition-transform"
                                            />
                                        </Link>
                                    )}
                                    <Link
                                        to="/connect"
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Users
                                                size={18}
                                                className="text-green-600"
                                            />
                                            <span className="font-medium text-gray-700">
                                                Find Friends
                                            </span>
                                        </div>
                                        <ChevronRight
                                            size={16}
                                            className="text-gray-400 group-hover:translate-x-1 transition-transform"
                                        />
                                    </Link>
                                    <Link
                                        to="/home/top"
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Flame
                                                size={18}
                                                className="text-orange-600"
                                            />
                                            <span className="font-medium text-gray-700">
                                                Top Posts
                                            </span>
                                        </div>
                                        <ChevronRight
                                            size={16}
                                            className="text-gray-400 group-hover:translate-x-1 transition-transform"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
