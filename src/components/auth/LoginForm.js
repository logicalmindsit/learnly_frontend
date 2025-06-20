import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Re-added
import {
  Box, TextField, Button, CircularProgress, Typography,
  RadioGroup, FormControlLabel, Radio, FormLabel, FormControl,
  IconButton, InputAdornment
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import authService from '../../components/services/authService';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/AuthContext';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loginWith, setLoginWith] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate(); // ✅ Re-added navigation hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginTypeChange = (e) => {
    setLoginWith(e.target.value);
    setFormData({ identifier: '', password: formData.password });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { password: formData.password };
      if (loginWith === 'email') {
        payload.email = formData.identifier;
      } else {
        payload.mobile = formData.identifier;
      }

      const response = await authService.login(payload);

      if (response.data && response.data.token) {
        toast.success(response.data.message || "Login Successful! Welcome.", {
          position: "top-center",
        });

        login(response.data.token, response.data.user.id);

        if (onLoginSuccess) onLoginSuccess();

        // ✅ Redirect to home page
        navigate("/");

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
      <FormControl component="fieldset" sx={{ mb: 1 }}>
        <FormLabel component="legend">Login with:</FormLabel>
        <RadioGroup row name="loginType" value={loginWith} onChange={handleLoginTypeChange}>
          <FormControlLabel value="email" control={<Radio />} label="Email" />
          <FormControlLabel value="mobile" control={<Radio />} label="Mobile" />
        </RadioGroup>
      </FormControl>

      <TextField
        margin="normal"
        required
        fullWidth
        id="identifier"
        label={loginWith === 'email' ? 'Email Address' : 'Mobile Number (with country code)'}
        name="identifier"
        autoComplete={loginWith === 'email' ? 'email' : 'tel'}
        placeholder={loginWith === 'mobile' ? '+1234567890' : ''}
        autoFocus
        value={formData.identifier}
        onChange={handleChange}
        InputProps={{
          startAdornment: loginWith === 'email'
            ? <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
            : <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />,
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
