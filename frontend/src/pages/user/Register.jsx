import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import MessagePage from "../../components/MessagePage";
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Calendar,
    Upload,
    CheckCircle,
    AlertCircle,
    BookOpen,
} from "lucide-react";
import { UserContext } from "../../context/UserContext";
import { NavrouteContext } from "../../context/NavrouteContext";

const Register = () => {
    const { user } = useContext(UserContext);
    const { setNavroute } = useContext(NavrouteContext);

    useEffect(() => {
        setNavroute("home-container");
    }, []);

    const [formData, setFormData] = useState({
        username: "",
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
        dob: "",
        avatar: null,
    });

    const [avatarPreview, setAvatarPreview] = useState(null);
    const navigate = useNavigate();
    const [countDown, setCountDown] = useState(5);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [registerError, setRegisterError] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                setCountDown(countDown - 1);
            }, 1000);
            if (countDown <= 0) {
                navigate("/user/profile");
                return;
            }
        }
    }, [countDown, user]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            setFormData({
                ...formData,
                [name]: file,
            });
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
        if (registerError) {
            setRegisterError("");
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username.trim())
            newErrors.username = "Username is required.";
        if (!formData.fullname.trim())
            newErrors.fullname = "Full name is required.";
        if (!formData.email.trim()) newErrors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Please enter a valid email address.";
        if (!formData.password) newErrors.password = "Password is required.";
        else if (formData.password.length < 6)
            newErrors.password = "Password must be at least 6 characters.";
        if (!formData.confirmPassword)
            newErrors.confirmPassword = "Please confirm your password.";
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";
        if (!formData.dob) newErrors.dob = "Date of birth is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setIsLoading(true);
            setRegisterError("");

            try {
                const formDataToSend = new FormData();
                formDataToSend.append("username", formData.username);
                formDataToSend.append("fullname", formData.fullname);
                formDataToSend.append("email", formData.email);
                formDataToSend.append("password", formData.password);
                formDataToSend.append("dob", formData.dob);
                if (formData.avatar) {
                    formDataToSend.append("avatar", formData.avatar);
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/user/register`,
                    formDataToSend,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.data.success) {
                    setTimeout(() => {
                        navigate("/user/login");
                    }, 500);
                }
            } catch (error) {
                console.log("Register error:", error);
                setRegisterError(
                    error.response?.data?.message ||
                        "Registration failed. Please try again."
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (user) {
        return <MessagePage message={"User is already logged in"} />;
    }

    return (
        <div className="min-h-screen bg-white pt-24">
            <div className="flex flex-col lg:flex-row">
                {/* Left Section - Info */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-50 p-12 flex-col justify-center">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-600 rounded-lg">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                LearnHub
                            </h1>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Join Our Learning Community
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Start your educational journey with thousands of
                            learners worldwide.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Access Quality Content
                                </h3>
                                <p className="text-gray-600">
                                    Learn from expertly curated educational
                                    resources
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Connect with Peers
                                </h3>
                                <p className="text-gray-600">
                                    Engage with a community of passionate
                                    learners
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Share Your Knowledge
                                </h3>
                                <p className="text-gray-600">
                                    Contribute and grow together with others
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Over 50,000+ students trusted us with their learning
                            journey
                        </p>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Create Account
                            </h2>
                            <p className="text-gray-600">
                                Sign up to get started with your learning
                            </p>
                        </div>

                        {/* Error Message */}
                        {registerError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <p className="text-red-800 text-sm">
                                    {registerError}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="bitandas"
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg font-medium outline-none transition-colors ${
                                            errors.username
                                                ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-red-50"
                                                : "border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 bg-white"
                                        }`}
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-red-600 text-xs mt-1.5">
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                        placeholder="Bitan Das"
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg font-medium outline-none transition-colors ${
                                            errors.fullname
                                                ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-red-50"
                                                : "border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 bg-white"
                                        }`}
                                    />
                                </div>
                                {errors.fullname && (
                                    <p className="text-red-600 text-xs mt-1.5">
                                        {errors.fullname}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="bitandas@example.com"
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg font-medium outline-none transition-colors ${
                                            errors.email
                                                ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-red-50"
                                                : "border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 bg-white"
                                        }`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-600 text-xs mt-1.5">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Birth
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg font-medium outline-none transition-colors ${
                                            errors.dob
                                                ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-red-50"
                                                : "border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 bg-white"
                                        }`}
                                    />
                                </div>
                                {errors.dob && (
                                    <p className="text-red-600 text-xs mt-1.5">
                                        {errors.dob}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`w-full pl-10 pr-10 py-2.5 border rounded-lg font-medium outline-none transition-colors ${
                                            errors.password
                                                ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-red-50"
                                                : "border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 bg-white"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-600 text-xs mt-1.5">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`w-full pl-10 pr-10 py-2.5 border rounded-lg font-medium outline-none transition-colors ${
                                            errors.confirmPassword
                                                ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-red-50"
                                                : "border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 bg-white"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-600 text-xs mt-1.5">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            {/* Avatar Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Picture
                                    <span className="text-gray-400">
                                        {" "}
                                        (Optional)
                                    </span>
                                </label>
                                <input
                                    type="file"
                                    name="avatar"
                                    onChange={handleChange}
                                    accept="image/*"
                                    className="hidden"
                                    id="avatar-input"
                                />
                                <label
                                    htmlFor="avatar-input"
                                    className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors bg-gray-50"
                                >
                                    {avatarPreview ? (
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={avatarPreview}
                                                alt="Preview"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <span className="text-sm text-gray-600">
                                                Click to change
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                                            <span className="text-sm text-gray-600">
                                                Upload an image
                                            </span>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 mt-6"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating account...
                                    </span>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <p className="text-center text-gray-600 text-sm mt-6">
                            Already have an account?{" "}
                            <Link
                                to="/user/login"
                                className="text-indigo-600 hover:text-indigo-700 font-semibold"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Countdown Message */}
            {user && (
                <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                    Redirecting in {countDown}s...
                </div>
            )}
        </div>
    );
};

export default Register;
