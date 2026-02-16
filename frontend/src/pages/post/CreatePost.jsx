import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MessagePage from "../../components/MessagePage";
import {
    PenTool,
    FileText,
    Tag,
    AlertCircle,
    CheckCircle,
    Lightbulb,
    BookOpen,
} from "lucide-react";
import { UserContext } from "../../context/UserContext";

const CreatePost = ({ setNavroute }) => {
    const { user } = useContext(UserContext);
    useEffect(() => {
        setNavroute("home-container");
    }, []);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tags: [],
    });

    const [tagInput, setTagInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [createError, setCreateError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
        if (createError) {
            setCreateError("");
        }
    };

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !formData.tags.includes(trimmedTag)) {
            setFormData({
                ...formData,
                tags: [...formData.tags, trimmedTag],
            });
            setTagInput("");
        }
    };

    const handleRemoveTag = (index) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((_, i) => i !== index),
        });
    };

    const handleTagKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = "Title is required.";
        } else if (formData.title.trim().length < 5) {
            newErrors.title = "Title must be at least 5 characters.";
        }

        if (!formData.content.trim()) {
            newErrors.content = "Content is required.";
        } else if (formData.content.trim().length < 20) {
            newErrors.content = "Content must be at least 20 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setIsLoading(true);
            setCreateError("");
            setSuccessMessage("");

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/user/post/create`,
                    {
                        title: formData.title.trim(),
                        content: formData.content.trim(),
                        tags: formData.tags,
                    },
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.data.success) {
                    setSuccessMessage(
                        "Post created successfully! Redirecting..."
                    );
                    setTimeout(() => {
                        navigate("/home");
                    }, 1500);
                }
            } catch (error) {
                console.log("Create post error:", error);
                setCreateError(
                    error.response?.data?.message ||
                        "Failed to create post. Please try again."
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (!user) {
        return <MessagePage message={"Please log in to create a post"} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <PenTool className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            Create Post
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg">
                        Share your knowledge and ideas with the community
                    </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-green-800">{successMessage}</p>
                    </div>
                )}

                {/* Error Message */}
                {createError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-red-800">{createError}</p>
                    </div>
                )}

                {/* Main Form Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Title Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <FileText className="w-4 h-4 text-indigo-600" />
                                    Post Title
                                </div>
                                <span className="text-xs text-gray-500 font-normal">
                                    Make it catchy and descriptive (min 5
                                    characters)
                                </span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Getting Started with React Hooks"
                                maxLength="200"
                                className={`w-full px-4 py-3 border rounded-lg font-medium outline-none transition-colors ${
                                    errors.title
                                        ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-red-50"
                                        : "border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 bg-white"
                                }`}
                            />
                            <div className="flex justify-between items-center mt-2">
                                {errors.title && (
                                    <p className="text-red-600 text-xs">
                                        {errors.title}
                                    </p>
                                )}
                                <p className="text-gray-500 text-xs ml-auto">
                                    {formData.title.length}/200
                                </p>
                            </div>
                        </div>

                        {/* Content Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <BookOpen className="w-4 h-4 text-indigo-600" />
                                    Post Content
                                </div>
                                <span className="text-xs text-gray-500 font-normal">
                                    Share your thoughts and ideas (min 20
                                    characters)
                                </span>
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Write your post content here. Be descriptive and engaging..."
                                rows="12"
                                maxLength="5000"
                                className={`w-full px-4 py-3 border rounded-lg font-medium outline-none transition-colors resize-none ${
                                    errors.content
                                        ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-red-50"
                                        : "border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 bg-white"
                                }`}
                            />
                            <div className="flex justify-between items-center mt-2">
                                {errors.content && (
                                    <p className="text-red-600 text-xs">
                                        {errors.content}
                                    </p>
                                )}
                                <p className="text-gray-500 text-xs ml-auto">
                                    {formData.content.length}/5000
                                </p>
                            </div>
                        </div>

                        {/* Tags Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Tag className="w-4 h-4 text-indigo-600" />
                                    Tags
                                </div>
                                <span className="text-xs text-gray-500 font-normal">
                                    Add tags to help others discover your post
                                    (optional)
                                </span>
                            </label>

                            {/* Tag Input */}
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) =>
                                        setTagInput(e.target.value)
                                    }
                                    onKeyPress={handleTagKeyPress}
                                    placeholder="Type a tag and press Enter"
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-6 py-2.5 bg-indigo-100 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-200 transition-colors"
                                >
                                    Add Tag
                                </button>
                            </div>

                            {/* Tags Display */}
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag, index) => (
                                        <div
                                            key={index}
                                            className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveTag(index)
                                                }
                                                className="text-indigo-600 hover:text-indigo-800 font-bold"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tips Section */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-blue-900 mb-2">
                                        Tips for a Great Post
                                    </h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>
                                            • Use a clear, descriptive title
                                        </li>
                                        <li>
                                            • Format your content for
                                            readability
                                        </li>
                                        <li>
                                            • Add relevant tags for better
                                            discoverability
                                        </li>
                                        <li>
                                            • Engage with comments from your
                                            readers
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate("/home")}
                                className="px-6 py-3 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all duration-200"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Publishing...
                                    </span>
                                ) : (
                                    "Publish Post"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
