import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, CircularProgress, Typography,
  IconButton, InputAdornment
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // A neutral icon for the combined field
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import authService from '../../components/services/authService';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/AuthContext';

const LoginForm = ({ onLoginSuccess }) => {
  // CHANGED: Simplified state for a single identifier field
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // REMOVED: handleLoginTypeChange is no longer needed

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // CHANGED: Logic to detect if input is email or mobile
      const { emailOrMobile, password } = formData;
      const payload = { password };

      // Simple detection: if it contains '@', it's an email. Otherwise, it's a mobile number.
      if (emailOrMobile.includes('@')) {
        payload.email = emailOrMobile;
      } else {
        payload.mobile = emailOrMobile;
      }

      const response = await authService.login(payload);

      if (response.data && response.data.token) {
        toast.success(response.data.message || "Login Successful! Welcome.", {
          position: "top-center",
        });

        login(response.data.token, response.data.user.id);
        if (onLoginSuccess) onLoginSuccess();
        
        navigate("/");
        setTimeout(() => window.location.reload(), 100);

      } else {
        toast.error("Login failed: Invalid response from server.");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {/* REMOVED: Radio button group is gone */}

      {/* CHANGED: A single text field for both email and mobile */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="emailOrMobile"
        label="Email or Mobile Number"
        name="emailOrMobile"
        autoComplete="email" // "email" works well for both
        placeholder="e.g., user@example.com or +1234567890"
        autoFocus
        value={formData.emailOrMobile}
        onChange={handleChange}
        InputProps={{
          startAdornment: <AccountCircleIcon sx={{ mr: 1, color: 'action.active' }} />,
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        InputProps={{
          startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
      </Button>
    </Box>
  );
};

export default LoginForm;