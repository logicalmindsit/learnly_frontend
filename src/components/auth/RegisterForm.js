import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const RegisterForm = ({ onRegisterSuccess, onError }) => {
  const [formData, setFormData] = useState({ emailOrMobile: '' });
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState(''); // State to hold validation error message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorText) {
      setErrorText(''); // Clear error when user starts typing again
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorText(''); // Clear previous errors

    // Trim whitespace from the input
    const emailOrMobile = formData.emailOrMobile.trim();

    if (!emailOrMobile) {
      const msg = "Email or Mobile Number is required.";
      setErrorText(msg);
      onError(msg); // Also inform parent if needed
      setLoading(false);
      return;
    }

    try {
      let payload = {};
      
      // --- THIS IS THE KEY LOGIC ---

      // 1. Check if the input looks like an email
      if (emailOrMobile.includes('@')) {
        // Use a regex for more robust email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile)) {
          const msg = "Invalid email format.";
          setErrorText(msg);
          onError(msg);
          setLoading(false);
          return;
        }
        // If valid, create an email payload
        payload = { email: emailOrMobile };
      } 
      // 2. Otherwise, treat it as a potential mobile number
      else {
        // Remove any spaces or non-digit characters except '+' at the start
        let mobileNumber = emailOrMobile.replace(/[^\d+]/g, '');

        // Check if it's a valid 10-digit number (and prepend +91 for Indian format)
        if (/^\d{10}$/.test(mobileNumber)) {
          payload = { mobile: `+91${mobileNumber}` };
        } 
        // Also allow if the user correctly enters the +91 prefix already
        else if (/^\+91\d{10}$/.test(mobileNumber)) {
            payload = { mobile: mobileNumber };
        }
        // 3. If it's neither a valid email nor a valid mobile number, show an error
        else {
          const msg = "Please enter a valid email or a 10-digit mobile number.";
          setErrorText(msg);
          onError(msg);
          setLoading(false);
          return;
        }
      }
      
      // --- END OF KEY LOGIC ---

      // If validation passes, send the correctly formatted payload to the parent
      console.log('Sending payload to backend:', payload);
      onRegisterSuccess(payload); // This will be either { email: '...' } or { mobile: '+91...' }

    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      setErrorText(msg);
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="emailOrMobile"
        label="Email or 10-Digit Mobile Number"
        name="emailOrMobile"
        autoComplete="email"
        autoFocus
        placeholder="e.g., user@example.com or 9876543210"
        value={formData.emailOrMobile}
        onChange={handleChange}
        error={!!errorText} // Show error state on TextField
        helperText={errorText} // Display the error message
        InputProps={{
          startAdornment: <AccountCircleIcon sx={{ mr: 1, color: 'action.active' }} />,
        }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
      </Button>
    </Box>
  );
};

export default RegisterForm;