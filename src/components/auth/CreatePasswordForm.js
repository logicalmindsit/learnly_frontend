
import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  CircularProgress, 
  IconButton, 
  InputAdornment, 
  Typography,
  Paper,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SecurityIcon from '@mui/icons-material/Security';

const CreatePasswordForm = ({ userIdentifier, onPasswordCreated, onError }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Password strength calculation
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const getStrengthColor = () => {
    if (passwordStrength <= 25) return '#f44336';
    if (passwordStrength <= 50) return '#ff9800';
    if (passwordStrength <= 75) return '#ffeb3b';
    return '#4caf50';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      onError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
        onError("Password must be at least 8 characters long.");
        return;
    }
    setLoading(true);
    try {
      const payload = { ...userIdentifier, password };
      onPasswordCreated(payload);
    } catch (err) {
      onError(err.message || 'Password creation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
      overflow: 'hidden',
      '&::-webkit-scrollbar': {
        display: 'none'
      },
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none'
    }}>
      <Card elevation={3} sx={{ 
        maxWidth: 400,
        width: '100%',
        borderRadius: 3,
        background: '#ffffff',
        border: '1px solid #bbdefb',
        overflow: 'hidden',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none'
      }}>
        <CardContent sx={{ 
          p: 3,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none'
        }}>
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2196f3, #1976d2)',
              mb: 2,
              boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)'
            }}>
              <SecurityIcon sx={{ fontSize: 24, color: 'white' }} />
            </Box>
            
            <Typography variant="h5" component="h1" sx={{ 
              fontWeight: 700,
              color: '#1976d2',
              mb: 1
            }}>
              Create Password
            </Typography>
            
            <Typography variant="body2" sx={{ 
              color: 'text.secondary',
              fontSize: '0.9rem',
              fontWeight: 400
            }}>
              Secure your account with a strong password
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {/* Password Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ 
                mb: 0.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8fbff',
                  '&:hover': {
                    backgroundColor: '#f0f7ff',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.2)'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ color: 'action.active' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Strength Indicator */}
            {password && (
              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                    Password Strength
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: getStrengthColor(),
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}>
                    {getStrengthText()}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getStrengthColor(),
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
            )}
            
            {/* Confirm Password Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmPassword && password !== confirmPassword}
              helperText={confirmPassword && password !== confirmPassword ? "Passwords don't match" : ""}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8fbff',
                  '&:hover': {
                    backgroundColor: '#f0f7ff',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.2)'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Requirements */}
            <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary', fontSize: '0.8rem' }}>
                Password Requirements:
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.3 }}>
                <Typography variant="caption" sx={{ 
                  color: password.length >= 8 ? 'success.main' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.7rem'
                }}>
                  {password.length >= 8 ? '✓' : '•'} At least 8 characters
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: /[A-Z]/.test(password) ? 'success.main' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.7rem'
                }}>
                  {/[A-Z]/.test(password) ? '✓' : '•'} Uppercase letter
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: /[a-z]/.test(password) ? 'success.main' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.7rem'
                }}>
                  {/[a-z]/.test(password) ? '✓' : '•'} Lowercase letter
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: /\d/.test(password) ? 'success.main' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.7rem'
                }}>
                  {/\d/.test(password) ? '✓' : '•'} Number
                </Typography>
              </Box>
            </Box>
            
            {/* Submit Button */}
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
                background: loading ? 'rgba(33, 150, 243, 0.6)' : '#2196f3',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(33, 150, 243, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: loading ? 'rgba(33, 150, 243, 0.6)' : '#1976d2',
                  boxShadow: loading ? 'none' : '0 6px 25px rgba(33, 150, 243, 0.5)',
                  transform: loading ? 'none' : 'translateY(-1px)'
                },
                '&:disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                  boxShadow: 'none'
                }
              }}
              disabled={loading || !password || password !== confirmPassword || passwordStrength < 50}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Creating Account...</span>
                </Box>
              ) : (
                'Set Password'
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreatePasswordForm;