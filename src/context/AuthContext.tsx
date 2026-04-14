import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI } from "../utils/api";
import type {
  User,
  AuthContextType,
  LoginCredentials,
  SignupData,
  AuthResult,
  AuthResponse,
} from "../types";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const userData = await authAPI.getProfile();
          setUser(userData);
        } catch (error) {
          // Silent fail
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      const response: AuthResponse = await authAPI.login(credentials);

      const token =
        response?.token ||
        response?.access_token ||
        response?.accessToken ||
        response?.data?.token;

      const userData =
        response?.user || response?.data?.user || response?.data || response;

      if (token) {
        localStorage.setItem("token", token);
        setUser(userData as User);
        return { success: true };
      }

      if (response) {
        localStorage.setItem("token", JSON.stringify(response));
        setUser(userData as User);
        return { success: true };
      }

      throw new Error("Login succeeded but no data received");
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const signup = async (userData: SignupData): Promise<AuthResult> => {
    try {
      const response: AuthResponse = await authAPI.register(userData);

      const token =
        response?.token ||
        response?.access_token ||
        response?.accessToken ||
        response?.data?.token;

      const user =
        response?.user || response?.data?.user || response?.data || response;

      if (token) {
        localStorage.setItem("token", token);
        setUser(user as User);
        return { success: true };
      }

      if (response) {
        localStorage.setItem("token", JSON.stringify(response));
        setUser(user as User);
        return { success: true };
      }

      throw new Error("Signup succeeded but no data received");
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Signup failed",
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Ignore errors
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-700 mx-auto"></div>
          <p className="mt-4 text-amber-900 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
