import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Flame, Users, ChevronRight, Filter, Search, Plus, ChevronLeft } from "lucide-react";
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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMorePages, setHasMorePages] = useState(false);
    const postsPerPage = 10;

    useEffect(() => {
        setNavroute("top-container");
        setCurrentPage(1);
        setLoading(true);
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [currentPage, filterEndDate, filterStartDate, filterTags, orderBy, seaerchKeywords]);

    const fetchPosts = async () => {
        try {
            const params = {
                pageNumber: currentPage,
            };
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
            const fetchedPosts = response.data.data || [];
            setPosts(fetchedPosts);
            
            // If we got fewer posts than requested, we're on the last page
            // Otherwise assume there might be more pages
            const hasMore = fetchedPosts.length === postsPerPage;
            setHasMorePages(hasMore);
            
            // If total is provided in response, use it; otherwise estimate
            if (response.data.total) {
                setTotalPages(Math.ceil(response.data.total / postsPerPage));
            } else if (hasMore) {
                setTotalPages(currentPage + 1);
            } else {
                setTotalPages(currentPage);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts([]);
            setHasMorePages(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-8">
                        <div className="h-12 bg-gray-200 rounded-lg w-96 mb-8"></div>
                        <div className="h-12 bg-gray-200 rounded-lg w-full mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                                    >
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                                        <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                                        <div className="flex justify-between">
                                            <div className="h-6 bg-gray-200 rounded w-24"></div>
                                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="lg:col-span-1 space-y-6">
                                <div className="h-96 bg-white rounded-xl shadow-sm border border-gray-200"></div>
                                <div className="h-48 bg-white rounded-xl shadow-sm border border-gray-200"></div>
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
                <div className="mb-12 space-y-6">
                    {/* Header with Icons */}
                    <div className="flex items-start gap-4 mb-8">
                        <div className="p-3 rounded-lg bg-blue-600 text-white">
                            <Flame size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Trending Posts
                            </h1>
                            <p className="text-gray-600">
                                Discover the most popular and trending content from our community
                            </p>
                        </div>
                    </div>

                    {/* Main Search Bar */}
                    <div className="bg-white rounded-lg border border-gray-300 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <div className="relative flex items-center">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Search size={20} />
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
                                className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500"
                            />
                            {seaerchKeywords && (
                                <button
                                    onClick={() => setSearchKeywords("")}
                                    className="mr-3 p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(filterTags.length > 0 ||
                        filterStartDate ||
                        filterEndDate ||
                        seaerchKeywords) && (
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                📌 Active Filters:
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {seaerchKeywords && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 border-2 border-blue-400 text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all">
                                        <Search size={16} strokeWidth={2.5} />
                                        "{seaerchKeywords}"
                                        <button
                                            onClick={() =>
                                                setSearchKeywords("")
                                            }
                                            className="ml-2 hover:scale-110 transition-transform font-black text-base"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                                {filterTags.map((tag) => (
                                    <div
                                        key={tag}
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
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
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                {filterStartDate && (
                                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                        📅 {filterStartDate.toLocaleDateString()}
                                        <button
                                            onClick={() =>
                                                setFilterStartDate(null)
                                            }
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                                {filterEndDate && (
                                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                        📅 {filterEndDate.toLocaleDateString()}
                                        <button
                                            onClick={() =>
                                                setFilterEndDate(null)
                                            }
                                            className="ml-2 text-gray-500 hover:text-gray-700"
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
                                <>
                                    <div className="space-y-6">
                                        {posts.map((post) => (
                                            <PostCardM
                                                key={post.id}
                                                post={post}
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {(hasMorePages || currentPage > 1) && (
                                        <div className="flex items-center justify-center gap-3 py-8">
                                            <button
                                                onClick={() =>
                                                    setCurrentPage(
                                                        Math.max(
                                                            1,
                                                            currentPage - 1
                                                        )
                                                    )
                                                }
                                                disabled={currentPage === 1}
                                                className="p-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>

                                            <div className="flex items-center gap-2">
                                                {/* Show current page and up to 2 adjacent pages */}
                                                {currentPage > 2 && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                setCurrentPage(
                                                                    1
                                                                )
                                                            }
                                                            className="w-9 h-9 rounded-lg font-semibold text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                        >
                                                            1
                                                        </button>
                                                        <span className="text-gray-400 font-bold">
                                                            ...
                                                        </span>
                                                    </>
                                                )}

                                                {currentPage > 1 && (
                                                    <button
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                currentPage -
                                                                    1
                                                            )
                                                        }
                                                        className="w-9 h-9 rounded-lg font-semibold text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                    >
                                                        {currentPage - 1}
                                                    </button>
                                                )}

                                                <button className="w-9 h-9 rounded-lg font-semibold text-sm bg-blue-600 text-white">
                                                    {currentPage}
                                                </button>

                                                {hasMorePages && (
                                                    <button
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                currentPage +
                                                                    1
                                                            )
                                                        }
                                                        className="w-9 h-9 rounded-lg font-semibold text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                    >
                                                        {currentPage + 1}
                                                    </button>
                                                )}
                                            </div>

                                            <button
                                                onClick={() =>
                                                    setCurrentPage(
                                                        currentPage + 1
                                                    )
                                                }
                                                disabled={!hasMorePages}
                                                className="p-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Flame size={28} className="text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        No posts found
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Try adjusting your filters or search terms
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
                        <div className="sticky top-24 space-y-6">
                            {/* Filter Controls */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-blue-600 text-white">
                                        <Filter size={18} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">
                                        Filters & Sort
                                    </h3>
                                </div>

                                {/* Sort */}
                                <div className="space-y-2.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Sort By
                                    </label>
                                    <select
                                        value={orderBy}
                                        onChange={(e) =>
                                            setOrderBy(e.target.value)
                                        }
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-800"
                                    >
                                        <option value="">📋 All Posts</option>
                                        <option value="date">
                                            📅 Most Recent
                                        </option>
                                        <option value="comments">
                                            💬 Most Comments
                                        </option>
                                        <option value="likes">
                                            ❤️ Most Liked
                                        </option>
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div className="space-y-2.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-800"
                                    />
                                </div>

                                {/* End Date */}
                                <div className="space-y-2.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-800"
                                    />
                                </div>

                                {/* Tags Filter Input */}
                                <div className="space-y-2.5 pt-5 border-t border-gray-200">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Filter by Tags
                                    </label>
                                    <div className="flex flex-col gap-2.5">
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
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-800"
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
                                            className="w-full px-4 py-2.5 bg-blue-600 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2 hover:bg-blue-700"
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
                                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-semibold transition-colors flex items-center justify-center gap-2 hover:bg-gray-200"
                                >
                                    <Filter size={16} />
                                    Reset All
                                </button>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    {active && (
                                        <Link
                                            to="/user/post/create"
                                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors group font-medium"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Plus size={18} className="text-blue-600" />
                                                <span>Create Post</span>
                                            </div>
                                            <ChevronRight
                                                size={16}
                                                className="text-gray-400 group-hover:translate-x-1 transition-transform"
                                            />
                                        </Link>
                                    )}
                                    <Link
                                        to="/connect"
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors group font-medium"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Users size={18} className="text-green-600" />
                                            <span>Find Friends</span>
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
