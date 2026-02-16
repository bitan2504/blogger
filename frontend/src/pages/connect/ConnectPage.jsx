import { useState, useEffect, useContext } from "react";
import axios from "axios";
import MessagePage from "../../components/MessagePage.jsx";
import ProfileCardM from "../../components/ProfileCardM.jsx";
import { Search, Users, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { UserContext } from "../../context/UserContext.jsx";
import { NavrouteContext } from "../../context/NavrouteContext.jsx";

const ConnectPage = () => {
    const { user: currentUser } = useContext(UserContext);
    const { setNavroute } = useContext(NavrouteContext);
    useEffect(() => {
        setNavroute("connect-container");
    }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 9;

    // Debounced search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setUsers([]);
            setHasSearched(false);
            setCurrentPage(1);
            setTotalPages(1);
            return;
        }

        const debounceTimer = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            return;
        }

        setLoading(true);
        setHasSearched(true);
        setCurrentPage(1);

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/user/search`,
                {
                    params: { query: searchQuery },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                const allUsers = response.data.data;
                setUsers(allUsers);
                setTotalPages(Math.ceil(allUsers.length / usersPerPage) || 1);
            }
        } catch (err) {
            console.error("Error searching users:", err);
            setUsers([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const getPaginatedUsers = () => {
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        return users.slice(startIndex, endIndex);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleFollowStatusChange = (userId, isFollowing) => {
        // Optional: Update user follow status in state
    };

    if (!currentUser) {
        return <MessagePage message={"Please login to connect with users"} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-blue-600 text-white">
                            <Users size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Connect
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Discover and follow interesting users
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="relative">
                        <Search
                            size={20}
                            className="absolute left-4 top-3.5 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search users by name or username..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    {searchQuery && (
                        <div className="mt-4 text-sm text-gray-600">
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Searching...
                                </div>
                            ) : hasSearched ? (
                                <span>
                                    {users.length} user
                                    {users.length !== 1 ? "s" : ""} found
                                </span>
                            ) : null}
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {hasSearched && (
                    <div>
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="text-center">
                                    <Loader
                                        size={40}
                                        className="animate-spin text-blue-600 mx-auto mb-4"
                                    />
                                    <p className="text-gray-600">
                                        Searching...
                                    </p>
                                </div>
                            </div>
                        ) : users.length > 0 ? (
                            <div>
                                {/* Users Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {getPaginatedUsers().map((user) => (
                                        <ProfileCardM
                                            key={user.id}
                                            user={user}
                                            currentUser={currentUser}
                                            onFollowStatusChange={
                                                handleFollowStatusChange
                                            }
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-4 py-8">
                                        <button
                                            onClick={handlePreviousPage}
                                            disabled={currentPage === 1}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft size={18} />
                                            Previous
                                        </button>

                                        <div className="flex items-center gap-2">
                                            {Array.from(
                                                { length: totalPages },
                                                (_, i) => (
                                                    <button
                                                        key={i + 1}
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                i + 1
                                                            )
                                                        }
                                                        className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                                                            currentPage ===
                                                            i + 1
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                )
                                            )}
                                        </div>

                                        <button
                                            onClick={handleNextPage}
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                )}

                                {/* Results Info */}
                                <div className="text-center text-sm text-gray-600 py-4">
                                    Showing{" "}
                                    {(currentPage - 1) * usersPerPage + 1} -{" "}
                                    {Math.min(
                                        currentPage * usersPerPage,
                                        users.length
                                    )}{" "}
                                    of {users.length} results
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center">
                                    <Users
                                        size={32}
                                        className="text-gray-400"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    No users found
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Try searching with different keywords or
                                    browse all users.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {!hasSearched && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <Search size={48} className="text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Discover New Users
                        </h3>
                        <p className="text-gray-600 mb-2 max-w-md mx-auto">
                            Search for users by their name or username to see
                            their profiles and follow them.
                        </p>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">
                            Start typing above to begin searching...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConnectPage;
