import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-white hover:text-blue-100 transition group"
          >
            <svg
              className="w-8 h-8 transform group-hover:scale-110 transition"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 000 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xl font-bold">TodoApp</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isActive("/")
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-white hover:bg-blue-500"
              }`}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  isActive("/profile")
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-white hover:bg-blue-500"
                }`}
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden sm:inline">Profile</span>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-white hover:bg-blue-500 rounded-lg transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
