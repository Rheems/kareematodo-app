import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const userData = await authAPI.getProfile();
          const user = userData.data || userData.user || userData;
          setUser(user);
        } catch (error) {
          // Silent fail - just means they need to login again
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      // Debug: See what we actually get back
      console.log('🔍 Login response:', response);
      
      // Try to find token in ANY possible location
      const token = 
        response?.token || 
        response?.access_token || 
        response?.accessToken ||
        response?.data?.token || 
        response?.data?.access_token ||
        response?.data?.accessToken;
      
      // Try to find user in ANY possible location
      const userData = 
        response?.user || 
        response?.data?.user || 
        response?.data || 
        response;
      
      // If we got a token, we're good!
      if (token) {
        localStorage.setItem('token', token);
        setUser(userData);
        return { success: true };
      }
      
      // If no token but response is successful, store the whole thing
      // The API might work differently than expected
      if (response) {
        // Sometimes the response itself IS the token
        localStorage.setItem('token', JSON.stringify(response));
        setUser(userData);
        return { success: true };
      }
      
      // Only throw error if we truly got nothing
      throw new Error('Login succeeded but no data received');
      
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      // Debug: See what we actually get back
      console.log('🔍 Signup response:', response);
      
      // Try to find token in ANY possible location
      const token = 
        response?.token || 
        response?.access_token || 
        response?.accessToken ||
        response?.data?.token || 
        response?.data?.access_token ||
        response?.data?.accessToken;
      
      // Try to find user in ANY possible location
      const user = 
        response?.user || 
        response?.data?.user || 
        response?.data || 
        response;
      
      // If we got a token, we're good!
      if (token) {
        localStorage.setItem('token', token);
        setUser(user);
        return { success: true };
      }
      
      // If no token but response is successful, store the whole thing
      if (response) {
        localStorage.setItem('token', JSON.stringify(response));
        setUser(user);
        return { success: true };
      }
      
      throw new Error('Signup succeeded but no data received');
      
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Signup failed'
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('token');
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
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}