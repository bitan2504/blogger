import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    Calendar,
    ChevronRight,
    Clock,
    Heart,
    MessageCircle,
    Share2,
} from "lucide-react";

const PostCardM = ({ post }) => {
    const navigate = useNavigate();
    const [thisPost, setThisPost] = useState(post);

    useEffect(() => {
        console.log(post);
        setThisPost(post);
    }, [post]);

    const handleLike = async (postId) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/post/like/toggle/${postId}`,
                {},
                { withCredentials: true }
            );

            setThisPost((prevPost) => ({
                ...prevPost,
                isLiked: res.data.data.isLiked,
                likesCount: res.data.data.likesCount,
            }));

            console.log(res, thisPost);
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    return (
        <div
            key={thisPost.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group"
        >
            {/* Post Header */}
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                            {thisPost.author?.username
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">
                                    @{thisPost.author?.username}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar size={14} />
                                {new Date(
                                    thisPost.createdAt
                                ).toLocaleDateString()}
                                <span className="text-gray-400">•</span>
                                <Clock size={14} />
                                {new Date(
                                    thisPost.createdAt
                                ).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Post Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                    {thisPost.title}
                </h3>
                <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                    {thisPost.content}
                </p>
            </div>

            {/* Post Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => handleLike(thisPost.id)}
                            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium"
                        >
                            <Heart
                                size={20}
                                className={
                                    thisPost.isLiked
                                        ? "fill-red-500 text-red-500"
                                        : ""
                                }
                            />
                            <span className="font-bold">
                                {`${thisPost.likesCount || 0}`}
                            </span>
                        </button>
                        <Link
                            to={`/post/${thisPost.id}`}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                        >
                            <MessageCircle size={20} />
                            <span className="font-bold">
                                {`${thisPost.commentsCount || 0}`}
                            </span>
                        </Link>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium">
                            <Share2 size={20} />
                            <span className="font-bold">Share</span>
                        </button>
                    </div>
                    <Link
                        to={`/post/${thisPost.id}`}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors group/read"
                    >
                        Read More
                        <ChevronRight
                            size={16}
                            className="group-hover/read:translate-x-1 transition-transform"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PostCardM;
