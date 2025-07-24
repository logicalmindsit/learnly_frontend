import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  CircularProgress, 
  Typography, 
  InputAdornment,
  useTheme,
  useMediaQuery,
  GlobalStyles
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Global CSS for animations
const globalStyles = (
  <GlobalStyles
    styles={{
      '@keyframes fadeInUp': {
        '0%': {
          opacity: 0,
          transform: 'translateY(30px)',
        },
        '100%': {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
      '@keyframes fadeIn': {
        '0%': {
          opacity: 0,
        },
        '100%': {
          opacity: 1,
        },
      },
      '@keyframes shimmer': {
        '0%': {
          backgroundPosition: '-200px 0',
        },
        '100%': {
          backgroundPosition: 'calc(200px + 100%) 0',
        },
      },
    }}
  />
);

const RegisterForm = ({ onRegisterSuccess, onError }) => {
  const [formData, setFormData] = useState({ emailOrMobile: '' });
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState(''); // State to hold validation error message
  const [inputType, setInputType] = useState('text'); // Track input type for icon display
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    
    // Dynamically detect input type for appropriate icon
    if (value.includes('@')) {
      setInputType('email');
    } else if (value && /^\d/.test(value.trim())) {
      setInputType('mobile');
    } else {
      setInputType('text');
    }
    
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
    <>
      {globalStyles}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
      {/* Mobile Title */}
      {isMobile && (
        <Typography 
          component="h1" 
          variant="h4" 
          sx={{ 
            mb: 3, 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #0D6EFD 0%, #8B5CF6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            fontSize: {
              xs: '1.6rem',
              sm: '1.8rem',
              md: '2.1rem'
            },
            letterSpacing: '-0.02em',
            animation: 'fadeInUp 0.6s ease-out'
          }}
        >
          Create Account
        </Typography>
      )}

      {/* Desktop Title - Hidden on mobile as it's shown in parent component */}
      {!isMobile && (
        <Typography 
          component="h1" 
          variant="h4" 
          sx={{ 
            mb: 2, 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #0D6EFD 0%, #8B5CF6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            fontSize: {
              xs: '1.6rem',
              sm: '1.8rem',
              md: '2.1rem'
            },
            letterSpacing: '-0.02em',
            animation: 'fadeInUp 0.6s ease-out'
          }}
        >
          Get Started
        </Typography>
      )}

      {!isMobile && (
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            color: '#6B7280',
            textAlign: 'center',
            fontSize: {
              xs: '0.9rem',
              sm: '1rem'
            },
            fontWeight: '400',
            lineHeight: 1.6,
            animation: 'fadeIn 0.8s ease-out 0.2s both'
          }}
        >
          Enter your email or mobile number to continue
        </Typography>
      )}

      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          mt: 1, 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeInUp 0.7s ease-out 0.1s both',
          '& .MuiTextField-root': {
            mb: {
              xs: 2.5,
              sm: 3
            }
          }
        }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="emailOrMobile"
          placeholder="Email or 10-Digit Mobile Number"
          name="emailOrMobile"
          autoComplete="username"
          autoFocus
          value={formData.emailOrMobile}
          onChange={handleChange}
          error={!!errorText} // Show error state on TextField
          helperText={errorText} // Display the error message
          variant="outlined"
          onFocus={(e) => {
            e.target.parentElement.parentElement.style.transform = 'scale(1.01)';
          }}
          onBlur={(e) => {
            e.target.parentElement.parentElement.style.transform = 'scale(1)';
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {inputType === 'email' ? (
                  <EmailIcon 
                    sx={{ 
                      color: errorText ? '#EF4444' : '#6B7280',
                      fontSize: {
                        xs: '1.3rem',
                        sm: '1.4rem',
                        md: '1.5rem'
                      },
                      transition: 'all 0.3s ease'
                    }} 
                  />
                ) : inputType === 'mobile' ? (
                  <PhoneIcon 
                    sx={{ 
                      color: errorText ? '#EF4444' : '#6B7280',
                      fontSize: {
                        xs: '1.3rem',
                        sm: '1.4rem',
                        md: '1.5rem'
                      },
                      transition: 'all 0.3s ease'
                    }} 
                  />
                ) : (
                  <PersonAddIcon 
                    sx={{ 
                      color: errorText ? '#EF4444' : '#6B7280',
                      fontSize: {
                        xs: '1.3rem',
                        sm: '1.4rem',
                        md: '1.5rem'
                      },
                      transition: 'all 0.3s ease'
                    }} 
                  />
                )}
              </InputAdornment>
            ),
            sx: { 
              borderRadius: '16px',
              backgroundColor: '#FAFBFC',
              backdropFilter: 'blur(10px)',
              fontSize: {
                xs: '0.9rem',
                sm: '1rem'
              },
              height: {
                xs: '52px',
                sm: '56px',
                md: '60px'
              },
              '& .MuiOutlinedInput-notchedOutline': { 
                border: errorText ? '2px solid #EF4444' : '1.5px solid #E5E7EB',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: errorText ? '#EF4444' : '#0D6EFD',
                borderWidth: '2px',
                boxShadow: errorText 
                  ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
                  : '0 0 0 3px rgba(13, 110, 253, 0.1)'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: errorText ? '#EF4444' : '#0D6EFD',
                borderWidth: '2px',
                boxShadow: errorText 
                  ? '0 0 0 4px rgba(239, 68, 68, 0.15)'
                  : '0 0 0 4px rgba(13, 110, 253, 0.15)'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-1px)',
                backgroundColor: '#F9FAFB'
              }
            }
          }}
          sx={{
            '& .MuiInputBase-input': {
              padding: {
                xs: '14px 16px',
                sm: '16px 16px',
                md: '18px 16px'
              },
              fontWeight: '500',
              '&::placeholder': {
                color: '#9CA3AF',
                opacity: 1
              }
            },
            '& .MuiFormHelperText-root': {
              fontSize: {
                xs: '0.8rem',
                sm: '0.875rem'
              },
              marginTop: '6px',
              marginLeft: '16px',
              fontWeight: '500'
            }
          }}
        />
        
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            mt: {
              xs: 2,
              sm: 3
            },
            mb: 2,
            borderRadius: '12px',
            padding: {
              xs: '10px 24px',
              sm: '12px 32px',
              md: '14px 40px'
            },
            fontWeight: '600',
            fontSize: {
              xs: '0.9rem',
              sm: '1rem'
            },
            background: loading 
              ? '#E5E7EB' 
              : '#007BFF',
            color: loading ? '#9CA3AF' : '#FFFFFF',
            textTransform: 'none',
            boxShadow: loading 
              ? 'none' 
              : '0 4px 15px rgba(0, 123, 255, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)',
            minHeight: {
              xs: '44px',
              sm: '48px',
              md: '52px'
            },
            maxWidth: {
              xs: '200px',
              sm: '220px',
              md: '240px'
            },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transition: 'left 0.6s ease'
            },
            '&:hover': !loading ? {
              background: '#0056B3',
              boxShadow: '0 6px 20px rgba(0, 123, 255, 0.5), 0 3px 12px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-2px)',
              '&::before': {
                left: '100%'
              }
            } : {},
            '&:active': !loading ? {
              transform: 'translateY(-1px)',
            } : {},
            '&:disabled': {
              background: '#E5E7EB',
              boxShadow: 'none',
              color: '#9CA3AF'
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress 
                size={isSmallMobile ? 18 : 20} 
                color="inherit"
                sx={{ 
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              />
              <Typography 
                component="span" 
                sx={{ 
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.7 }
                  }
                }}
              >
                Sending...
              </Typography>
            </Box>
          ) : (
            <Typography 
              component="span" 
              sx={{ 
                fontSize: 'inherit',
                fontWeight: 'inherit',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-2px',
                  left: '50%',
                  width: '0',
                  height: '2px',
                  background: 'rgba(255,255,255,0.5)',
                  transition: 'all 0.3s ease',
                  transform: 'translateX(-50%)'
                }
              }}
            >
              Send OTP
            </Typography>
          )}
        </Button>

        {/* Additional spacing for mobile */}
        {isMobile && (
          <Box sx={{ height: '20px' }} />
        )}
      </Box>
    </Box>
    </>
  );
};

export default RegisterForm;