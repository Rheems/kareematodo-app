import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const userData = await authAPI.getProfile();

          // Handle different response structures
          const user = userData.data || userData.user || userData;
          setUser(user);

          console.log("✅ User authenticated:", user.email || user.name);
        } catch (error) {
          console.error("⚠️ Auth check failed:", error.message);

          // Only clear token if it's definitely unauthorized (401)
          // Don't clear on network errors or temporary issues
          if (error.response?.status === 401) {
            console.log("❌ Token invalid - clearing");
            localStorage.removeItem("token");
            setUser(null);
          } else {
            console.log("⚠️ Network error - keeping token for retry");
            // Keep the user logged in, they might just have temporary network issues
          }
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);

      // Handle different response structures
      const token = data.token || data.access_token || data.data?.token;
      const user = data.user || data.data?.user || data.data;

      if (!token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", token);
      setUser(user);

      console.log("✅ Login successful:", user.email || user.name);

      return { success: true };
    } catch (error) {
      console.error("❌ Login failed:", error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Login failed",
      };
    }
  };

  const signup = async (userData) => {
    try {
      const data = await authAPI.register(userData);

      // Handle different response structures
      const token = data.token || data.access_token || data.data?.token;
      const user = data.user || data.data?.user || data.data;

      if (!token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", token);
      setUser(user);

      console.log("✅ Signup successful:", user.email || user.name);

      return { success: true };
    } catch (error) {
      console.error("❌ Signup failed:", error.message);
      return {
        success: false,
        error:
          error.response?.data?.message || error.message || "Signup failed",
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("⚠️ Logout error (ignored):", error.message);
      // Don't throw - logout should always succeed on client side
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
