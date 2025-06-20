import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../auth/LoginForm';
import AuthLayout from '../auth/common/AuthLayout';
import { Typography, Link as MuiLink } from '@mui/material';


const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <AuthLayout title="Welcome Back!">
      <LoginForm />
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don't have an account?{' '}
        <MuiLink component="button" variant="body2" onClick={() => navigate('/signup')}>
          Sign up here
        </MuiLink>
      </Typography>
      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
        <MuiLink component="button" variant="body2" onClick={() => navigate('/forgot-password')}>
          Forgot Password?
        </MuiLink>
      </Typography>
    </AuthLayout>
  );
};

export default LoginPage;