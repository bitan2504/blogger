import { useEffect, useState } from "react";

const PostCardS = ({ post, index }) => {
    const [item, setItem] = useState(post);
    const [currentIndex, setCurrentIndex] = useState(index);

    useEffect(() => {
        setItem(post);
        setCurrentIndex(index);
    }, [post, index]);

    return (
        <div
            key={item.id}
            className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all group cursor-pointer"
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-100 to-red-100 flex items-center justify-center">
                    {index && !isNaN(index) && (
                        <span className="text-sm font-bold text-orange-600">
                            {currentIndex + 1}
                        </span>
                    )}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
                        {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>@{item.author?.username}</span>
                        <span>•</span>
                        <span>{item.likesCount} likes</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCardS;
