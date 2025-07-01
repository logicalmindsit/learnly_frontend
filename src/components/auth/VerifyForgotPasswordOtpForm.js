
import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  CircularProgress, 
  Typography,
  Paper,
  Stack
} from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const VerifyForgotPasswordOtpForm = ({ userIdentifier, onOtpVerified, onError }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...userIdentifier, otp };
      onOtpVerified(payload);
    } catch (err) {
      onError(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ 
      maxWidth: 450,
      mx: 'auto',
      p: 4,
      borderRadius: 3,
      boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.08)'
    }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ 
        fontWeight: 600,
        color: 'primary.main',
        mb: 2
      }}>
        Password Reset
      </Typography>
      
      <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
        We've sent a verification code to {userIdentifier.email || userIdentifier.mobile}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="otp"
          label="Verification Code"
          name="otp"
          autoFocus
          value={otp}
          onChange={handleChange}
          inputProps={{ maxLength: 6 }}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: <VpnKeyIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />
        
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ 
              py: 1.5,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
            }}
            disabled={loading || otp.length < 6}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Code'}
          </Button>
        </Stack>
        
        <Typography variant="body2" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
          Didn't receive a code?{' '}
          <Button variant="text" size="small" sx={{ fontWeight: 600 }}>
            Resend Code
          </Button>
        </Typography>
      </Box>
    </Paper>
  );
};

export default VerifyForgotPasswordOtpForm;