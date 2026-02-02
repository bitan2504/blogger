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
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
        >
            {/* Post Header */}
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                                {thisPost.author?.username
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                            </div>
                            {thisPost.author?.verified && (
                                <div className="absolute -top-1 -right-1 p-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                                    <Sparkles
                                        size={10}
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
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(
                                        thisPost.createdAt
                                    ).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {new Date(
                                        thisPost.createdAt
                                    ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye size={12} />
                                    {thisPost.views || 0} views
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Post Title & Content */}
                <Link to={`/user/post/show?id=${thisPost.id}`}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {thisPost.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        {thisPost.content}
                    </p>
                </Link>

                {/* Tags */}
                {thisPost.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {thisPost.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Post Stats & Actions */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Heart size={14} className="text-red-500" />
                                <span className="font-medium">
                                    {thisPost.likesCount || 0}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageCircle
                                    size={14}
                                    className="text-blue-500"
                                />
                                <span className="font-medium">
                                    {thisPost.commentsCount || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                            thisPost.isLiked
                                ? "bg-gradient-to-r from-red-50 to-red-100 text-red-600 border border-red-200"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <Heart
                            size={16}
                            className={
                                thisPost.isLiked
                                    ? "fill-red-500 text-red-500"
                                    : ""
                            }
                        />
                        {thisPost.isLiked ? "Liked" : "Like"}
                    </button>

                    <button
                        onClick={() => setShowCommentBar(!showCommentBar)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-600 border border-gray-200 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                        <MessageCircle size={16} />
                        {showCommentBar ? "Hide Comments" : "Show Comments"}
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-600 border border-gray-200 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                        <Share2 size={16} />
                        Share
                    </button>
                </div>
            </div>

            {/* Comment Input Bar */}
            {showCommentBar && (
                <div className="border-t border-gray-100">
                    <div className="p-6">
                        {/* New Comment Form */}
                        <div className="mb-6">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
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
                                        placeholder="Write a comment..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        onKeyPress={(e) =>
                                            e.key === "Enter" &&
                                            handleSubmitComment()
                                        }
                                    />
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                                                <Smile
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                                                <ImageIcon
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                                                <LinkIcon
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500">
                                                Press Enter to post
                                            </span>
                                            <button
                                                onClick={handleSubmitComment}
                                                disabled={!newComment.trim()}
                                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                <Send size={14} />
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-gray-900">
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
                                <div className="text-center py-8">
                                    <MessageCircle
                                        size={32}
                                        className="text-gray-300 mx-auto mb-3"
                                    />
                                    <p className="text-gray-500">
                                        No comments yet. Be the first to
                                        comment!
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
