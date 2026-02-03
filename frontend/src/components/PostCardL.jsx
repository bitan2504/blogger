import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    Calendar,
    ChevronRight,
    Clock,
    Heart,
    MessageCircle,
    Share2,
    Send,
    Smile,
    Image as ImageIcon,
    Link as LinkIcon,
    User,
    Eye,
    Sparkles,
    MoreVertical,
    Bookmark,
} from "lucide-react";
import CommentCard from "./CommentCard";

const PostCardL = ({ post }) => {
    const [thisPost, setThisPost] = useState(post);
    const [showCommentBar, setShowCommentBar] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [isLiking, setIsLiking] = useState(false);
    const [isSaved, setIsSaved] = useState(post?.isSaved || false);
    const [comments, setComments] = useState(post?.comments || []);

    useEffect(() => {
        setThisPost(post);
        setComments(post?.comments || []);
    }, [post]);

    const handleLike = async () => {
        if (isLiking) return;

        setIsLiking(true);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/post/like/toggle/${thisPost.id}`,
                {},
                { withCredentials: true }
            );

            setThisPost((prev) => ({
                ...prev,
                isLiked: res.data.data.isLiked,
                likesCount: res.data.data.likesCount,
            }));
        } catch (error) {
            console.error("Error liking post:", error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleSave = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/post/${thisPost.id}/save`,
                {},
                { withCredentials: true }
            );

            setIsSaved(res.data.data.isSaved);
        } catch (error) {
            console.error("Error saving post:", error);
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/post/comment/create/${thisPost.id}`,
                { content: newComment },
                { withCredentials: true }
            );

            // Add new comment to the comments list
            setComments((prev) => [response.data.data, ...prev]);
            setNewComment("");

            // Update post comment count
            setThisPost((prev) => ({
                ...prev,
                commentsCount: (prev.commentsCount || 0) + 1,
            }));
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    const handleShare = async () => {
        try {
            const shareData = {
                title: thisPost?.title,
                text: thisPost?.content?.substring(0, 100) + "...",
                url: `${window.location.origin}/user/post/show?id=${thisPost.id}`,
            };

            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                // Show visual feedback
                const shareBtn = document.querySelector(
                    `[data-post-id="${thisPost.id}"] .share-icon`
                );
                if (shareBtn) {
                    shareBtn.classList.add("text-emerald-500");
                    setTimeout(
                        () => shareBtn.classList.remove("text-emerald-500"),
                        1000
                    );
                }
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    return (
        <div
            data-post-id={thisPost.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
            {/* Post Header */}
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                {thisPost.author?.username
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                            </div>
                            {thisPost.author?.verified && (
                                <div className="absolute -top-1 -right-1 p-1 bg-blue-600 rounded-full">
                                    <Sparkles
                                        size={12}
                                        className="text-white"
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">
                                    @{thisPost.author?.username}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    {new Date(
                                        thisPost.createdAt
                                    ).toLocaleDateString()}
                                </div>
                                <span className="text-gray-400">•</span>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} />
                                    {new Date(
                                        thisPost.createdAt
                                    ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                                <span className="text-gray-400">•</span>
                                <div className="flex items-center gap-1.5">
                                    <Eye size={14} />
                                    {thisPost.views || 0} views
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        className={`p-2.5 rounded-lg transition-colors ${
                            isSaved
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        <Bookmark
                            size={20}
                            className={isSaved ? "fill-white" : ""}
                        />
                    </button>
                </div>

                {/* Post Title & Content */}
                <Link to={`/user/post/show?id=${thisPost.id}`}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                        {thisPost.title}
                    </h3>
                    <p className="text-gray-700 mb-5 leading-relaxed">
                        {thisPost.content}
                    </p>
                </Link>

                {/* Tags */}
                {thisPost.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {thisPost.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Post Stats & Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Heart size={16} className="text-red-500" />
                            <span>{thisPost.likesCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <MessageCircle size={16} className="text-blue-600" />
                            <span>{thisPost.commentsCount || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-colors ${
                            thisPost.isLiked
                                ? "bg-red-600 text-white"
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <Heart
                            size={18}
                            className={
                                thisPost.isLiked
                                    ? "fill-white text-white"
                                    : ""
                            }
                        />
                        {thisPost.isLiked ? "Liked" : "Like"}
                    </button>

                    <button
                        onClick={() => setShowCommentBar(!showCommentBar)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-gray-700 border border-gray-200 font-semibold hover:bg-gray-50 transition-colors"
                    >
                        <MessageCircle size={18} />
                        {showCommentBar ? "Hide" : "Comment"}
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-gray-700 border border-gray-200 font-semibold hover:bg-gray-50 transition-colors"
                    >
                        <Share2 size={18} />
                        Share
                    </button>
                </div>
            </div>

            {/* Comment Input Bar */}
            {showCommentBar && (
                <div className="border-t border-gray-200 bg-white">
                    <div className="p-6">
                        {/* New Comment Form */}
                        <div className="mb-8">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                                        Y
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) =>
                                            setNewComment(e.target.value)
                                        }
                                        placeholder="Share your thoughts..."
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                                        onKeyPress={(e) =>
                                            e.key === "Enter" &&
                                            handleSubmitComment()
                                        }
                                    />
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                                                <Smile
                                                    size={18}
                                                    className="text-gray-500"
                                                />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                                                <ImageIcon
                                                    size={18}
                                                    className="text-gray-500"
                                                />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                                                <LinkIcon
                                                    size={18}
                                                    className="text-gray-500"
                                                />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-600">
                                                Press Enter ↵
                                            </span>
                                            <button
                                                onClick={handleSubmitComment}
                                                disabled={!newComment.trim()}
                                                className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                <Send size={16} />
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <MessageCircle size={18} className="text-blue-600" />
                                    Comments ({comments.length})
                                </h4>
                            </div>

                            {comments.length > 0 ? (
                                <>
                                    {comments.map((comment) => (
                                        <CommentCard
                                            key={comment.id}
                                            comment={comment}
                                        />
                                    ))}
                                </>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <MessageCircle
                                        size={40}
                                        className="text-gray-300 mx-auto mb-4"
                                    />
                                    <p className="text-gray-700 font-semibold text-lg">
                                        No comments yet
                                    </p>
                                    <p className="text-gray-500 mt-1">
                                        Be the first to share your thoughts!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCardL;
