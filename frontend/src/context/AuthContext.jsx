import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, userService } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("signin"); // "signin" | "signup"

  useEffect(() => {
    // Restore session from localStorage
    const savedToken = localStorage.getItem("jwt");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.signin(email, password);
    if (data.error) {
      throw new Error(data.error);
    }
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setAuthModalOpen(false);
      return data.user;
    }
    throw new Error("Invalid response from server");
  };

  const signup = async (userData) => {
    const data = await authService.signup(userData);
    if (data.error) {
      const errMsg = typeof data.error === "object"
        ? Object.values(data.error).filter(Boolean)[0] || "Registration failed"
        : data.error;
      throw new Error(errMsg);
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const quickLoginHospital = async () => {
    return await login("hospital@aims.org", "hospital12345");
  };

  const quickLoginAdmin = async () => {
    return await login("admin@organease.org", "admin12345");
  };

  const openLoginModal = () => {
    setAuthModalMode("signin");
    setAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthModalMode("signup");
    setAuthModalOpen(true);
  };

  const isAdmin = user && (user.role === 1 || user.userRole === 1);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        login,
        signup,
        logout,
        updateUserProfile,
        quickLoginHospital,
        quickLoginAdmin,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openLoginModal,
        openSignupModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
