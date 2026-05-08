import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("publicVoiceToken") || null
  );
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === "admin";

  const loadCurrentUser = async () => {
    try {
      const savedToken = localStorage.getItem("publicVoiceToken");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      const response = await api.get("/auth/me");

      if (response.data.success) {
        setUser(response.data.user);
        setToken(savedToken);
      }
    } catch (error) {
      localStorage.removeItem("publicVoiceToken");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const register = async (formData) => {
    try {
      const response = await api.post("/auth/register", formData);

      if (response.data.success) {
        localStorage.setItem("publicVoiceToken", response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        toast.success("Registration successful");
        return {
          success: true
        };
      }

      return {
        success: false,
        message: response.data.message
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed";

      toast.error(message);

      return {
        success: false,
        message
      };
    }
  };

  const login = async (formData) => {
    try {
      const response = await api.post("/auth/login", formData);

      if (response.data.success) {
        localStorage.setItem("publicVoiceToken", response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        toast.success("Login successful");
        return {
          success: true
        };
      }

      return {
        success: false,
        message: response.data.message
      };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";

      toast.error(message);

      return {
        success: false,
        message
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("publicVoiceToken");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        register,
        login,
        logout,
        loadCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};