import { useState, useEffect } from "react";
import {
    MoreVertical,
    Sparkles,
    Calendar,
    Clock,
} from "lucide-react";

export default function CommentCard({ comment }) {
    const [thisComment, setThisComment] = useState(comment);

    useEffect(() => {
        setThisComment(comment);
    }, [comment]);

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 p-4">
            <div className="flex gap-3">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-sm">
                            {thisComment.author?.username
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                        </div>
                        {thisComment.author?.verified && (
                            <div className="absolute -top-1 -right-1 p-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                                <Sparkles size={10} className="text-white" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                    {/* Comment Header */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                                @{thisComment.author?.username}
                            </span>
                            {thisComment.author?.verified && (
                                <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full">
                                    Verified
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                                {formatTimeAgo(thisComment.createdAt)}
                            </span>
                            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                                <MoreVertical
                                    size={14}
                                    className="text-gray-400"
                                />
                            </button>
                        </div>
                    </div>

                    {/* Comment Date & Time */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(
                                thisComment.createdAt
                            ).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(thisComment.createdAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                            )}
                        </div>
                    </div>

                    {/* Comment Text */}
                    <p className="text-gray-700 mb-4">{thisComment.content}</p>
                </div>
            </div>
        </div>
    );
}
