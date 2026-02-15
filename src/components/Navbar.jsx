import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Reduced text on mobile */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-white hover:text-blue-100 transition group"
          >
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 transform group-hover:scale-110 transition"
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
            <span className="text-lg sm:text-xl font-bold">TodoApp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition font-medium ${
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                  isActive("/profile")
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-white hover:bg-blue-500"
                }`}
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span>Profile</span>
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-blue-500 transition"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition font-medium ${
                isActive("/")
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-white hover:bg-blue-500"
              }`}
            >
              🏠 Home
            </Link>

            {isAuthenticated ? (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition font-medium ${
                  isActive("/profile")
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-white hover:bg-blue-500"
                }`}
              >
                👤 Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-white hover:bg-blue-500 rounded-lg transition font-medium"
                >
                  🔐 Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium shadow-md"
                >
                  ✨ Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
