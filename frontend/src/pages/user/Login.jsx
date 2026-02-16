import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MessagePage from "../../components/MessagePage.jsx";
import {
    LogIn,
    Lock,
    Mail,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    Sparkles,
    Shield,
    Key,
    Users,
    Globe,
} from "lucide-react";
import { UserContext } from "../../context/UserContext.jsx";
import { NavrouteContext } from "../../context/NavrouteContext.jsx";

export default function Login() {
    const { active, setActive, login } = useContext(UserContext);
    const { setNavroute } = useContext(NavrouteContext);

    useEffect(() => {
        setNavroute("home-container");
    }, []);

    const [formData, setFormData] = useState({
        uid: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
        if (loginError) {
            setLoginError("");
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.uid.trim())
            newErrors.uid = "Username or Email is required.";
        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setIsLoading(true);
            setLoginError("");

            try {
                const response = await login(formData.uid, formData.password);

                if (response.success) {
                    setActive(true);
                    setTimeout(() => {
                        navigate("/home");
                    }, 500);
                }
            } catch (error) {
                console.log("Login error:", error);
                setLoginError(
                    error.response?.data?.message ||
                        "Invalid credentials. Please try again."
                );
                const form = e.target;
                form.classList.add("shake");
                setTimeout(() => form.classList.remove("shake"), 500);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            {active ? (
                <MessagePage message={"User is logged in."} />
            ) : (
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-20 px-4">
                    {/* Decorative Background Elements */}
                    <div className="fixed inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left Side - Welcome Content */}
                            <div className="hidden lg:block">
                                <div className="space-y-8">
                                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
                                        <Globe size={24} />
                                        <span className="text-lg font-semibold">
                                            Welcome to Community
                                        </span>
                                    </div>

                                    <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                                        Join Our
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                            Growing Community
                                        </span>
                                    </h1>

                                    <p className="text-xl text-gray-600 leading-relaxed">
                                        Connect with amazing creators, share
                                        your ideas, and discover inspiring
                                        content from people around the world.
                                    </p>

                                    {/* Features List */}
                                    <div className="space-y-6 mt-10">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100">
                                                <Users
                                                    size={24}
                                                    className="text-blue-600"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    10,000+ Creators
                                                </h3>
                                                <p className="text-gray-600">
                                                    Join a vibrant community of
                                                    content creators
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-100 to-green-100">
                                                <Sparkles
                                                    size={24}
                                                    className="text-emerald-600"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    100,000+ Posts
                                                </h3>
                                                <p className="text-gray-600">
                                                    Discover amazing content
                                                    across all categories
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100">
                                                <Shield
                                                    size={24}
                                                    className="text-purple-600"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Secure & Private
                                                </h3>
                                                <p className="text-gray-600">
                                                    Your data is always
                                                    protected and encrypted
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Login Form */}
                            <div>
                                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                                    {/* Form Header */}
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                                            <Shield
                                                size={28}
                                                className="text-white"
                                            />
                                        </div>
                                        <h1 className="text-3xl font-bold text-white mb-3">
                                            Welcome Back
                                        </h1>
                                        <p className="text-blue-100 text-lg">
                                            Sign in to access your account
                                        </p>
                                    </div>

                                    {/* Form Content */}
                                    <div className="p-8">
                                        {loginError && (
                                            <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200">
                                                <div className="flex items-center gap-3 text-red-700">
                                                    <div className="p-2 rounded-lg bg-red-500/20">
                                                        <Key size={18} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">
                                                            {loginError}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-6"
                                        >
                                            {/* Username/Email Field */}
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                                    <User size={18} />
                                                    Username or Email Address
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Mail
                                                            size={20}
                                                            className="text-gray-400"
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="uid"
                                                        value={formData.uid}
                                                        onChange={handleChange}
                                                        placeholder="Enter your username or email"
                                                        className={`w-full pl-12 pr-4 py-4 bg-white rounded-xl border ${
                                                            errors.uid
                                                                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                                                : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                        } outline-none transition-all duration-200 focus:shadow-lg text-base`}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                                {errors.uid && (
                                                    <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                        {errors.uid}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Password Field */}
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                                    <Lock size={18} />
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Lock
                                                            size={20}
                                                            className="text-gray-400"
                                                        />
                                                    </div>
                                                    <input
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        name="password"
                                                        value={
                                                            formData.password
                                                        }
                                                        onChange={handleChange}
                                                        placeholder="Enter your password"
                                                        className={`w-full pl-12 pr-12 py-4 bg-white rounded-xl border ${
                                                            errors.password
                                                                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                                                : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                        } outline-none transition-all duration-200 focus:shadow-lg text-base`}
                                                        disabled={isLoading}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            togglePasswordVisibility
                                                        }
                                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff
                                                                size={20}
                                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                                            />
                                                        ) : (
                                                            <Eye
                                                                size={20}
                                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                                            />
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.password && (
                                                    <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                        {errors.password}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Forgot Password */}
                                            <div className="flex justify-end">
                                                <Link
                                                    to="/user/forgot-password"
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2 group"
                                                >
                                                    Forgot your password?
                                                    <ArrowRight
                                                        size={14}
                                                        className="group-hover:translate-x-1 transition-transform"
                                                    />
                                                </Link>
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <div className="flex items-center justify-center gap-3">
                                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span className="text-base">
                                                            Signing in...
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-3">
                                                        <LogIn size={20} />
                                                        <span className="text-base">
                                                            Sign In to Your
                                                            Account
                                                        </span>
                                                        <ArrowRight
                                                            size={18}
                                                            className="group-hover:translate-x-1 transition-transform"
                                                        />
                                                    </div>
                                                )}
                                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                                            </button>
                                        </form>

                                        {/* Divider */}
                                        {/* <div className="my-8 flex items-center">
                                            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200"></div>
                                            <span className="px-6 text-sm text-gray-500">
                                                or continue with
                                            </span>
                                            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                                        </div> */}

                                        {/* Social Login */}
                                        {/* <div className="grid grid-cols-2 gap-4 mb-8">
                                            <button
                                                type="button"
                                                className="flex items-center justify-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="#4285F4"
                                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    />
                                                    <path
                                                        fill="#34A853"
                                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    />
                                                    <path
                                                        fill="#FBBC05"
                                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                    />
                                                    <path
                                                        fill="#EA4335"
                                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                    />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-700">
                                                    Google
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                className="flex items-center justify-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-gray-700"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-700">
                                                    GitHub
                                                </span>
                                            </button>
                                        </div> */}

                                        {/* Sign Up Link */}
                                        <div className="text-center pt-8 border-t border-gray-100">
                                            <p className="text-gray-600 text-base">
                                                Don't have an account?{" "}
                                                <Link
                                                    to="/user/register"
                                                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-2 group"
                                                >
                                                    Create an account
                                                    <Sparkles
                                                        size={16}
                                                        className="group-hover:scale-110 group-hover:rotate-12 transition-transform"
                                                    />
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Note */}
                                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-white shadow-sm">
                                            <Shield
                                                size={20}
                                                className="text-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-blue-800">
                                                Enterprise-grade security
                                            </p>
                                            <p className="text-sm text-blue-600 mt-1">
                                                All connections are encrypted
                                                with SSL/TLS. Your password is
                                                never stored in plain text.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile-only welcome section */}
                    <div className="lg:hidden mt-12">
                        <div className="text-center space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Join Our Growing Community
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Connect with amazing creators and discover
                                inspiring content
                            </p>
                        </div>
                    </div>

                    {/* Add CSS for animations */}
                    <style jsx>{`
                        @keyframes shake {
                            0%,
                            100% {
                                transform: translateX(0);
                            }
                            10%,
                            30%,
                            50%,
                            70%,
                            90% {
                                transform: translateX(-5px);
                            }
                            20%,
                            40%,
                            60%,
                            80% {
                                transform: translateX(5px);
                            }
                        }
                        .shake {
                            animation: shake 0.5s
                                cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
                        }
                        @keyframes blob {
                            0% {
                                transform: translate(0px, 0px) scale(1);
                            }
                            33% {
                                transform: translate(30px, -50px) scale(1.1);
                            }
                            66% {
                                transform: translate(-20px, 20px) scale(0.9);
                            }
                            100% {
                                transform: translate(0px, 0px) scale(1);
                            }
                        }
                        .animate-blob {
                            animation: blob 7s infinite;
                        }
                        .animation-delay-2000 {
                            animation-delay: 2s;
                        }
                        .animation-delay-4000 {
                            animation-delay: 4s;
                        }
                    `}</style>
                </div>
            )}
        </>
    );
}
