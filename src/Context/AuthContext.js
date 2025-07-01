
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios"; // Using axios for easier API calls

// API Base URL - configure this to your actual backend URL
const API_BASE_URL = "https://learnly-backend-05ix.onrender.com"; // Example: Replace with your actual API base URL

// Default placeholder image (e.g., a generic avatar)
const DEFAULT_AVATAR =
  "https://via.placeholder.com/150/CCCCCC/FFFFFF?Text=No+Image";

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the Provider component that will wrap your app
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getToken = () => localStorage.getItem("token"); // Adjust 'authToken' if your key is different

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");
      const token = getToken();
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/profiles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);

        setProfilePicturePreview(
          response.data.profilePicture?.url || DEFAULT_AVATAR
        );
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch profile data."
        );
        console.error("Fetch profile error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // This hook checks localStorage when the app first loads
  useEffect(() => {
      const token = localStorage.getItem("token");
      
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // This function will be called from your LoginForm
  const login = (token, userId) => {
      localStorage.setItem("token", token);
      localStorage.setItem('userId', userId);
    setIsLoggedIn(true);
  };

  // This function will be called from your Header's new logout button
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    // Redirect to homepage to reset any state
    window.location.href = "/";
  };

  const value = {
    isLoggedIn,
    login,

    logout,
    userData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook to easily use this context in other components
export const useAuth = () => {
  return useContext(AuthContext);
};
