

import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  CircularProgress, 
  IconButton, 
  InputAdornment, 
  Typography,
  Paper
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ResetPasswordForm = ({ userIdentifier, onPasswordReset, onError }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      onError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
        onError("Password must be at least 8 characters long.");
        return;
    }
    setLoading(true);
    try {
      const payload = { ...userIdentifier, newPassword };
      onPasswordReset(payload);
    } catch (err) {
      onError(err.message || 'Password reset failed.');
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
        Reset Password
      </Typography>
      
      <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
        Create a new password for your account
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="newPassword"
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          id="newPassword"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 2 }}
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
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm New Password"
          type={showPassword ? 'text' : 'password'}
          id="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />
        
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
            textTransform: 'none'
          }}
          disabled={loading || !newPassword || newPassword !== confirmPassword}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ResetPasswordForm;