import React from 'react';
import { Container, Box, Paper, Typography } from '@mui/material';
// import logo from '../../assets/logo.png'; // Example logo

const AuthLayout = ({ children, title }) => {
  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* <img src={logo} alt="Logo" style={{ width: '80px', marginBottom: '16px' }} /> */}
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Box sx={{ width: '100%' }}>
          {children}
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthLayout;