import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Flame, Link, LogIn, Plus } from "lucide-react";
import { NavrouteContext } from "../context/NavrouteContext";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
    const { navroute } = useContext(NavrouteContext);
    const { user, active } = useContext(UserContext);
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setUsername(user?.username ?? null);
    }, [user]);

    const baseItem =
        "group relative flex items-center justify-center rounded-lg p-3 transition-colors duration-200";

    const activeItem = "bg-blue-50 text-blue-600";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                {/* Logo Section */}
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <img
                            src="/img/navbar.png"
                            alt="Logo"
                            width={28}
                            className="select-none"
                        />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-gray-900">
                            blogger
                        </span>
                        <div className="text-xs text-gray-500">
                            Learning Platform
                        </div>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex items-center gap-1">
                    <NavLink
                        to="/home"
                        className={`${baseItem} ${
                            navroute === "home-container" && activeItem
                        } ${!active ? "text-gray-600 hover:text-blue-600 hover:bg-gray-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
                    >
                        <Home size={20} />
                        <span className="ml-2 text-sm font-medium">Home</span>
                    </NavLink>

                    <NavLink
                        to="/home/top"
                        className={`${baseItem} ${
                            navroute === "top-container" && activeItem
                        } ${!active ? "text-gray-600 hover:text-blue-600 hover:bg-gray-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
                    >
                        <Flame size={20} />
                        <span className="ml-2 text-sm font-medium">
                            Top Posts
                        </span>
                    </NavLink>

                    <NavLink
                        to="/connect"
                        className={`${baseItem} ${
                            navroute === "connect-container" && activeItem
                        } ${!active ? "text-gray-600 hover:text-blue-600 hover:bg-gray-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
                    >
                        <Link size={20} />
                        <span className="ml-2 text-sm font-medium">
                            Connect
                        </span>
                    </NavLink>

                    {/* Spacer */}
                    <div className="w-px h-8 bg-gray-200 mx-3"></div>

                    {/* Auth Section */}
                    {!active ? (
                        <NavLink
                            to="/user/login"
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                        >
                            <LogIn size={18} />
                            <span>Sign In</span>
                        </NavLink>
                    ) : (
                        <div className="flex items-center gap-3">
                            {/* Profile Button */}
                            <button
                                onClick={() => navigate("/user/profile")}
                                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={username}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600">
                                        <span className="text-white text-xs font-bold">
                                            {username
                                                ?.charAt(0)
                                                ?.toUpperCase() || "U"}
                                        </span>
                                    </div>
                                )}
                                <span className="font-medium">@{username}</span>
                            </button>

                            {/* Create Post Button */}
                            <button
                                onClick={() => navigate("/user/post/create")}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={18} />
                                <span>Create</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
