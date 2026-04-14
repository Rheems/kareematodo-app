import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-amber-50 hover:text-amber-100 transition group flex-shrink-0"
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
            <span className="text-xl font-bold hidden sm:inline">TodoApp</span>
            <span className="text-lg font-bold sm:hidden">Todo</span>
          </Link>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition font-medium ${
                isActive("/")
                  ? "bg-amber-50 text-amber-900 shadow-md"
                  : "text-amber-50 hover:bg-amber-600"
              }`}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                  isActive("/profile")
                    ? "bg-amber-50 text-amber-900 shadow-md"
                    : "text-amber-50 hover:bg-amber-600"
                }`}
              >
                <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-amber-900 font-bold shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span>Profile</span>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-amber-50 hover:bg-amber-600 rounded-lg transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-amber-50 text-amber-900 rounded-lg hover:bg-amber-100 transition font-medium shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Only Shows on Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-amber-50 p-2 rounded-lg hover:bg-amber-600 transition focus:outline-none focus:ring-2 focus:ring-amber-300"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              // X icon when menu is open
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon when menu is closed
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown - Only on Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-2 border-t border-amber-600">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition font-medium ${
                isActive("/")
                  ? "bg-amber-50 text-amber-900 shadow-md"
                  : "text-amber-50 hover:bg-amber-600"
              }`}
            >
              🏠 Home
            </Link>

            {isAuthenticated ? (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                  isActive("/profile")
                    ? "bg-amber-50 text-amber-900 shadow-md"
                    : "text-amber-50 hover:bg-amber-600"
                }`}
              >
                <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-amber-900 font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span>Profile</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-amber-50 hover:bg-amber-600 rounded-lg transition font-medium"
                >
                  🔐 Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-amber-50 text-amber-900 rounded-lg hover:bg-amber-100 transition font-medium shadow-md"
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
