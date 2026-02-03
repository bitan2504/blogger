import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MessagePage from "../../components/MessagePage.jsx";
import axios from "axios";
import PostCardL from "../../components/PostCardL.jsx";
import { 
  ArrowLeft, 
  Home, 
  RefreshCw, 
  Users, 
  TrendingUp,
  Sparkles,
  Flame,
  Clock,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  MoreVertical
} from "lucide-react";
import PostCardS from "../../components/PostCardS.jsx";

export default function PostPage() {
    const { postID } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [postAvailable, setPostAvailable] = useState(true);
    const [refreshBit, setRefreshBit] = useState(true);

    useEffect(() => {
        const fetchPostData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const postResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/post/${postID}?relatedPosts=true`, {
                        withCredentials: true,
                    });

                if (postResponse.data?.success) {
                    setPost(postResponse.data.data);
                    setPostAvailable(true);
                } else {
                    setPostAvailable(false);
                    setPost(null);
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                setError("Failed to load post. Please try again.");
                setPostAvailable(false);
            } finally {
                setLoading(false);
            }
        };

        if (postID) {
            fetchPostData();
        }
    }, [postID, refreshBit]);

    const handleRefresh = () => {
        setRefreshBit(prev => !prev);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Loading Skeleton */}
                    <div className="animate-pulse space-y-6">
                        {/* Back Navigation Skeleton */}
                        <div className="h-10 bg-gray-200 rounded-lg w-32 mb-8"></div>
                        
                        {/* Post Skeleton */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
                                <div className="space-y-3 flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
                            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!postAvailable) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-white rounded-xl shadow-sm p-10 border border-gray-200">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-red-100 flex items-center justify-center">
                            <Flame size={32} className="text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Post Not Available</h2>
                        <p className="text-gray-600 mb-8">
                            The post you're looking for doesn't exist or has been removed.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/home"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Home size={18} />
                                Back to Home
                            </Link>
                            <button
                                onClick={handleRefresh}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <RefreshCw size={18} />
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-white rounded-xl shadow-sm p-10 border border-gray-200">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-red-100 flex items-center justify-center">
                            <Sparkles size={32} className="text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Something Went Wrong</h2>
                        <p className="text-gray-600 mb-8">{error}</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={handleRefresh}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <RefreshCw size={18} />
                                Retry
                            </button>
                            <Link
                                to="/home"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <ArrowLeft size={18} />
                                Go Back
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Post Column */}
                    <div className="lg:col-span-2">
                        {/* Main Post Card */}
                        <PostCardL post={post} />
                        
                        {/* Comments Section Header */}
                        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-blue-600 text-white">
                                        <MessageCircle size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Discussion</h3>
                                        <p className="text-sm text-gray-600">
                                            {post.commentsCount || 0} comments • Join the conversation
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <Clock size={14} />
                                    Updated just now
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Author Info */}
                            {post.author && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                            {post.author.username?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">@{post.author.username}</h4>
                                            <p className="text-sm text-gray-600">Post Author</p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/user/profile?username=${post.author.username}`}
                                        className="block w-full text-center py-2.5 text-white bg-blue-600 font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            )}

                            {/* Related Posts */}
                            {post && post.relatedPosts?.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-blue-600 text-white">
                                            <TrendingUp size={18} />
                                        </div>
                                        <h4 className="font-bold text-gray-900">Related Posts</h4>
                                    </div>
                                    <div className="space-y-3">
                                        {post?.relatedPosts.slice(0, 3).map((relatedPost, index) => (
                                            <Link
                                                key={relatedPost.id}
                                                to={`/post/${relatedPost.id}`}
                                                className="block"
                                            >
                                                <PostCardS post={relatedPost} index={index} />
                                            </Link>
                                        ))}
                                    </div>
                                    {post?.relatedPosts.length > 3 && (
                                        <Link
                                            to="/home/top"
                                            className="mt-4 block text-center text-blue-600 hover:text-blue-700 font-semibold text-sm"
                                        >
                                            View more posts →
                                        </Link>
                                    )}
                                </div>
                            )}


                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h4 className="font-bold text-gray-900 mb-4 text-lg">Quick Actions</h4>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-left font-medium text-gray-700">
                                        <MessageCircle size={18} className="text-blue-600" />
                                        <span>Write Comment</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-left font-medium text-gray-700">
                                        <Share2 size={18} className="text-green-600" />
                                        <span>Share with Friends</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}