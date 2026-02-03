import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Flame, Users, ChevronRight, Filter, Search, Plus } from "lucide-react";
import axios from "axios";
import PostCardM from "../../components/PostCardM";

const Home = ({ active, setNavroute }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const [filterTags, setFilterTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);
    const [orderBy, setOrderBy] = useState("");
    const [seaerchKeywords, setSearchKeywords] = useState("");

    useEffect(() => {
        setNavroute("home-container");
        fetchPosts();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [filterEndDate, filterStartDate, filterTags, orderBy]);

    const fetchPosts = async () => {
        try {
            const params = {};
            if (orderBy) {
                params.orderBy = orderBy;
            }
            if (filterTags.length > 0) {
                params.tags = filterTags.join(",");
            }
            if (filterStartDate && !isNaN(filterStartDate)) {
                params.startDate = filterStartDate.toISOString();
            }
            if (filterEndDate && !isNaN(filterEndDate)) {
                params.endDate = filterEndDate.toISOString();
            }
            if (seaerchKeywords) {
                params.keywords = seaerchKeywords;
            }

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/post`,
                { params, withCredentials: true }
            );
            setPosts(response.data.data || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

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
                {/* Search and Filter Section */}
                <div className="mb-10 space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                            <Search size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Discover Posts
                            </h2>
                            <p className="text-sm text-gray-600">
                                Search and filter to find exactly what you're
                                looking for
                            </p>
                        </div>
                    </div>

                    {/* Main Search Bar */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative bg-white rounded-2xl p-1 border border-gray-200">
                            <div className="relative flex items-center">
                                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Search size={22} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by title, keywords, topics..."
                                    value={seaerchKeywords}
                                    onChange={(e) => {
                                        setSearchKeywords(e.target.value);
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            fetchPosts();
                                        }
                                    }}
                                    className="w-full pl-14 pr-6 py-4 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 text-lg"
                                />
                                {seaerchKeywords && (
                                    <button
                                        onClick={() => setSearchKeywords("")}
                                        className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(filterTags.length > 0 ||
                        filterStartDate ||
                        filterEndDate ||
                        seaerchKeywords) && (
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-600">
                                Active Filters:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {seaerchKeywords && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-300 text-blue-700 rounded-full text-sm font-semibold shadow-sm">
                                        <Search size={14} />
                                        Keyword: "{seaerchKeywords}"
                                        <button
                                            onClick={() =>
                                                setSearchKeywords("")
                                            }
                                            className="ml-2 hover:text-blue-900 font-bold"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                                {filterTags.map((tag) => (
                                    <div
                                        key={tag}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-indigo-50 border border-indigo-300 text-indigo-700 rounded-full text-sm font-semibold shadow-sm"
                                    >
                                        #{tag}
                                        <button
                                            onClick={() =>
                                                setFilterTags(
                                                    filterTags.filter(
                                                        (t) => t !== tag
                                                    )
                                                )
                                            }
                                            className="ml-2 hover:text-indigo-900 font-bold"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                {filterStartDate && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-green-50 border border-green-300 text-green-700 rounded-full text-sm font-semibold shadow-sm">
                                        📅 From:{" "}
                                        {filterStartDate.toLocaleDateString()}
                                        <button
                                            onClick={() =>
                                                setFilterStartDate(null)
                                            }
                                            className="ml-2 hover:text-green-900 font-bold"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                                {filterEndDate && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-300 text-orange-700 rounded-full text-sm font-semibold shadow-sm">
                                        📅 To:{" "}
                                        {filterEndDate.toLocaleDateString()}
                                        <button
                                            onClick={() =>
                                                setFilterEndDate(null)
                                            }
                                            className="ml-2 hover:text-orange-900 font-bold"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
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
                        <div className="sticky top-24 space-y-6">
                            {/* Filter Controls */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Filter size={18} className="text-gray-700" />
                                    <h3 className="font-semibold text-gray-900">
                                        Filters & Sorting
                                    </h3>
                                </div>

                                {/* Sort */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        Sort By
                                    </label>
                                    <select
                                        value={orderBy}
                                        onChange={(e) =>
                                            setOrderBy(e.target.value)
                                        }
                                        className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-gray-700 hover:from-gray-100 hover:to-gray-200"
                                    >
                                        <option value="">None</option>
                                        <option value="date">
                                            📅 Most Recent
                                        </option>
                                        <option value="comments">
                                            🔥 Most Comments
                                        </option>
                                        <option value="likes">
                                            ❤️ Most Likes
                                        </option>
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        From Date
                                    </label>
                                    <input
                                        type="date"
                                        value={
                                            filterStartDate
                                                ? filterStartDate
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={(e) => {
                                            setFilterStartDate(
                                                e.target.value
                                                    ? new Date(e.target.value)
                                                    : null
                                            );
                                        }}
                                        className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-gray-700 hover:from-gray-100 hover:to-gray-200"
                                    />
                                </div>

                                {/* End Date */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        To Date
                                    </label>
                                    <input
                                        type="date"
                                        value={
                                            filterEndDate
                                                ? filterEndDate
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={(e) => {
                                            setFilterEndDate(
                                                e.target.value
                                                    ? new Date(e.target.value)
                                                    : null
                                            );
                                        }}
                                        className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-gray-700 hover:from-gray-100 hover:to-gray-200"
                                    />
                                </div>

                                {/* Tags Filter Input */}
                                <div className="space-y-2 pt-4 border-t border-gray-200">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        Filter by Tags
                                    </label>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter a tag..."
                                            value={tagInput}
                                            onChange={(e) =>
                                                setTagInput(e.target.value)
                                            }
                                            onKeyPress={(e) => {
                                                if (
                                                    e.key === "Enter" &&
                                                    tagInput.trim()
                                                ) {
                                                    if (
                                                        !filterTags.includes(
                                                            tagInput.trim()
                                                        )
                                                    ) {
                                                        setFilterTags([
                                                            ...filterTags,
                                                            tagInput.trim(),
                                                        ]);
                                                    }
                                                    setTagInput("");
                                                }
                                            }}
                                            className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium text-gray-700 hover:from-gray-100 hover:to-gray-200"
                                        />
                                        <button
                                            onClick={() => {
                                                if (tagInput.trim()) {
                                                    if (
                                                        !filterTags.includes(
                                                            tagInput.trim()
                                                        )
                                                    ) {
                                                        setFilterTags([
                                                            ...filterTags,
                                                            tagInput.trim(),
                                                        ]);
                                                    }
                                                    setTagInput("");
                                                }
                                            }}
                                            className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 border border-indigo-300 rounded-xl hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold transition-all flex items-center justify-center gap-2 hover:shadow-md"
                                        >
                                            + Add Tag
                                        </button>
                                    </div>
                                </div>

                                {/* Reset Button */}
                                <button
                                    onClick={() => {
                                        setOrderBy("");
                                        setFilterStartDate(null);
                                        setFilterEndDate(null);
                                        setFilterTags([]);
                                        setSearchKeywords("");
                                        setTagInput("");
                                    }}
                                    className="w-full px-4 py-2.5 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl hover:from-red-100 hover:to-orange-100 text-red-700 font-semibold transition-all flex items-center justify-center gap-2 hover:shadow-md"
                                >
                                    <Filter size={16} />
                                    Reset All Filters
                                </button>
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
