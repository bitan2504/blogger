import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Flame, Link, LogIn, Plus, User, Sun, Sparkles } from "lucide-react";

export default function Navbar({ active, user, navroute }) {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(user?.username ?? null);
  }, [user]);

  const baseItem =
    "group relative flex items-center justify-center rounded-xl p-2.5 transition-all duration-300 hover:scale-105";

  const activeItem =
    "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-200 shadow-md";

  return (
    <nav className="fixed top-6 left-1/2 z-50 w-[92%] max-w-5xl -translate-x-1/2 rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-200 shadow-lg shadow-gray-200/30">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl blur opacity-20"></div>
            <img
              src="/img/navbar.png"
              alt="Logo"
              width={40}
              className="relative select-none drop-shadow-sm"
            />
            <div className="absolute -top-1 -right-1">
              <Sun size={12} className="text-amber-500" />
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-800">
            blogger
          </span>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center gap-1">
          <NavLink
            to="/home"
            className={`${baseItem} ${
              navroute === "home-container" && activeItem
            } ${!active ? "text-gray-600 hover:text-blue-600 hover:bg-gray-50" : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"}`}
          >
            <Home size={20} />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 scale-95 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 shadow-lg">
              Home
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </span>
          </NavLink>

          <NavLink
            to="/home/top"
            className={`${baseItem} ${
              navroute === "top-container" && activeItem
            } ${!active ? "text-gray-600 hover:text-orange-600 hover:bg-gray-50" : "text-gray-500 hover:text-orange-600 hover:bg-gray-50"}`}
          >
            <Flame size={20} className={navroute === "top-container" ? "text-orange-500" : ""} />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 scale-95 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 shadow-lg">
              Top Posts
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </span>
          </NavLink>

          <NavLink
            to="/connect"
            className={`${baseItem} ${
              navroute === "connect-container" && activeItem
            } ${!active ? "text-gray-600 hover:text-emerald-600 hover:bg-gray-50" : "text-gray-500 hover:text-emerald-600 hover:bg-gray-50"}`}
          >
            <Link size={20} className={navroute === "connect-container" ? "text-emerald-500" : ""} />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 scale-95 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 shadow-lg">
              Connect
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </span>
          </NavLink>

          {/* Spacer */}
          <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2"></div>

          {/* Auth Section */}
          {!active ? (
            <NavLink
              to="/user/login"
              className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95"
            >
              <LogIn size={16} />
              Sign In
              <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </NavLink>
          ) : (
            <div className="flex items-center gap-3">
              {/* Profile Button */}
              <button
                onClick={() => navigate("/user/profile")}
                className="group relative flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 border border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
                  <User size={14} className="text-blue-600" />
                </div>
                <span className="font-medium">@{username}</span>
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>

              {/* Create Post Button */}
              <button
                onClick={() => navigate("/user/post/create")}
                className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95"
              >
                <div className="relative">
                  <Plus size={18} />
                  <div className="absolute inset-0 animate-ping opacity-20">
                    <Plus size={18} />
                  </div>
                </div>
                Create Post
                <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Accent Glow */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-blue-100/30 via-indigo-100/30 to-purple-100/30 blur-xl opacity-50"></div>
    </nav>
  );
}