import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const ForgotPasswordForm = ({ onOtpRequested, onError }) => {
  const [identifier, setIdentifier] = useState('');
  const [requestWith, setRequestWith] = useState('email'); // 'email' or 'mobile'
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setIdentifier(e.target.value);
  };

  const handleRequestTypeChange = (e) => {
    setRequestWith(e.target.value);
    setIdentifier(''); // Reset identifier field on type change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = requestWith === 'email' ? { email: identifier } : { mobile: identifier };
       if (!identifier) {
        onError(`${requestWith === 'email' ? 'Email' : 'Mobile'} is required.`);
        setLoading(false);
        return;
      }
      onOtpRequested(payload); // Pass payload to parent (ForgotPasswordPage)
    } catch (err) {
      onError(err.message || 'Failed to request OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">Request OTP via:</FormLabel>
        <RadioGroup row name="requestType" value={requestWith} onChange={handleRequestTypeChange}>
          <FormControlLabel value="email" control={<Radio />} label="Email" />
          <FormControlLabel value="mobile" control={<Radio />} label="Mobile" />
        </RadioGroup>
      </FormControl>

      <TextField
        margin="normal"
        required
        fullWidth
        id="identifier"
        label={requestWith === 'email' ? 'Email Address' : 'Mobile Number (with country code)'}
        name="identifier"
        autoComplete={requestWith === 'email' ? 'email' : 'tel'}
        placeholder={requestWith === 'mobile' ? '+1234567890' : ''}
        autoFocus
        value={identifier}
        onChange={handleChange}
        InputProps={{
          startAdornment: requestWith === 'email' 
            ? <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
            : <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />,
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset OTP'}
      </Button>
    </Box>
  );
};

export default ForgotPasswordForm;