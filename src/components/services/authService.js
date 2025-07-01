// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const register = (data) => {
  return axios.post(`${API_URL}/register`, data);
};

const verifyOtp = (data) => {
  return axios.post(`${API_URL}/verify-otp`, data);
};

const createPassword = (data) => {
  return axios.post(`${API_URL}/create-password`, data);
};

const saveProfileData = (formData, userIdentifier) => {
  if (userIdentifier.email) formData.append('email', userIdentifier.email);
  if (userIdentifier.mobile) formData.append('mobile', userIdentifier.mobile);
  
  // Change "/form" to "/register-form" here
  return axios.post(`${API_URL}/form`, formData,   { 
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const login = (data) => {
  return axios.post(`${API_URL}/login`, data);
};

// --- FORGOT PASSWORD ---
const forgotPasswordRequest = (data) => {
  return axios.post(`${API_URL}/forgot-password`, data);
};

const verifyForgotPasswordOtp = (data) => {
  return axios.post(`${API_URL}/verify-forgot-password-otp`, data);
};

// Renaming frontend function for clarity, maps to backend's ForgotResetPassword
const resetPassword = (data) => {
  return axios.post(`${API_URL}/reset-password`, data);
};
// --- END FORGOT PASSWORD ---


const authService = {
  register,
  verifyOtp,
  createPassword,
  saveProfileData,
  login,
  forgotPasswordRequest,
  verifyForgotPasswordOtp,
  resetPassword,
};

export default authService;