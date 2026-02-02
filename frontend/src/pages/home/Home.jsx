import { useState, useEffect, useRef } from "react";
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

const Home = ({ active, setNavroute }) => {
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
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded-lg w-64 mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
                                    >
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                                        <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                                        <div className="flex justify-between">
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                            <div className="h-4 bg-gray-200 rounded w-32"></div>
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
            className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-20 px-4"
            ref={containerRef}
        >
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl mb-6 shadow-lg">
                        <Sparkles size={20} />
                        <span className="text-sm font-semibold">
                            Welcome to blogger
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Discover Amazing Content
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            From Creative Minds
                        </span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                        Join thousands of creators sharing their ideas,
                        insights, and stories. Connect, learn, and grow
                        together.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <Search
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search for topics, creators, or keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all shadow-sm hover:shadow-md"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {categories.map((category) => (
                            <button
                                key={category.name}
                                className={`px-4 py-2 rounded-xl font-medium transition-all hover:scale-105 ${category.color}`}
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
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                {filters.map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() =>
                                            setActiveFilter(filter.id)
                                        }
                                        disabled={filter.disabled}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                                            activeFilter === filter.id
                                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                                                : filter.disabled
                                                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                                  : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                        }`}
                                    >
                                        {filter.id === "popular" && (
                                            <TrendingUp size={16} />
                                        )}
                                        {filter.id === "recent" && (
                                            <Clock size={16} />
                                        )}
                                        {filter.id === "following" && (
                                            <Users size={16} />
                                        )}
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all">
                                <Filter size={16} />
                                Filter
                            </button>
                        </div>

                        {/* Posts Grid */}
                        <div className="space-y-6">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostCardM key={post.id} post={post} />
                                ))
                            ) : (
                                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                                        <Flame
                                            size={32}
                                            className="text-blue-500"
                                        />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        No posts yet
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Be the first to share something amazing!
                                    </p>
                                    {active && (
                                        <Link
                                            to="/user/post/create"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                                        >
                                            <Plus size={20} />
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
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                            <Flame size={20} />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Trending Now
                                        </h2>
                                    </div>
                                    <TrendingUp
                                        size={20}
                                        className="text-orange-500"
                                    />
                                </div>

                                <div className="space-y-4">
                                    {trending.length > 0 ? (
                                        trending.map((item, index) => (
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
                                    className="mt-6 flex items-center justify-center gap-2 w-full py-3 text-blue-600 hover:text-blue-700 font-medium bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                                >
                                    View All Trending
                                    <ChevronRight size={16} />
                                </Link>
                            </div>

                            {/* Quick Links */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    {active && (
                                        <Link
                                            to="/user/post/create"
                                            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                                                    <Plus size={16} />
                                                </div>
                                                <span className="font-medium">
                                                    Create Post
                                                </span>
                                            </div>
                                            <ChevronRight
                                                size={16}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            />
                                        </Link>
                                    )}
                                    <Link
                                        to="/connect"
                                        className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 hover:from-emerald-100 hover:to-green-100 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                                                <Users size={16} />
                                            </div>
                                            <span className="font-medium">
                                                Find Friends
                                            </span>
                                        </div>
                                        <ChevronRight
                                            size={16}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        />
                                    </Link>
                                    <Link
                                        to="/home/top"
                                        className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 hover:from-orange-100 hover:to-red-100 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                                <Flame size={16} />
                                            </div>
                                            <span className="font-medium">
                                                Top Posts
                                            </span>
                                        </div>
                                        <ChevronRight
                                            size={16}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
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
