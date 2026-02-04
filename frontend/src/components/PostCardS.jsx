import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const PostCardS = ({ post, index }) => {
    const [item, setItem] = useState(post);
    const [currentIndex, setCurrentIndex] = useState(index);

    useEffect(() => {
        setItem(post);
        setCurrentIndex(index);
    }, [post, index]);

    return (
        <Link
            to={`/post/${item.id}`}
            key={item.id}
            className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 bg-white hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    {index && !isNaN(index) && (
                        <span className="text-sm font-bold text-white">
                            {currentIndex + 1}
                        </span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1.5 line-clamp-2 text-sm leading-tight">
                        {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="font-medium">@{item.author?.username}</span>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center gap-1">
                            <TrendingUp size={12} className="text-blue-600" />
                            <span className="font-medium">{item.likesCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PostCardS;
