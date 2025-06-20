// import React, { useState } from 'react';
// import { Box, TextField, Button, CircularProgress, IconButton, InputAdornment, Typography } from '@mui/material';
// import LockIcon from '@mui/icons-material/Lock';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

// const CreatePasswordForm = ({ userIdentifier, onPasswordCreated, onError }) => {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleClickShowPassword = () => setShowPassword(!showPassword);
//   const handleMouseDownPassword = (event) => event.preventDefault();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       onError("Passwords do not match.");
//       return;
//     }
//     // Basic password strength check (backend does more)
//     if (password.length < 8) {
//         onError("Password must be at least 8 characters long.");
//         return;
//     }
//     setLoading(true);
//     try {
//       const payload = { ...userIdentifier, password };
//       onPasswordCreated(payload); // Pass to parent (SignupPage)
//     } catch (err) {
//       onError(err.message || 'Password creation failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
//       <Typography variant="body1" sx={{mb: 2}}>
//         Create a secure password for {userIdentifier.email || userIdentifier.mobile}.
//       </Typography>
//       <TextField
//         margin="normal"
//         required
//         fullWidth
//         name="password"
//         label="Password"
//         type={showPassword ? 'text' : 'password'}
//         id="password"
//         autoComplete="new-password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         InputProps={{
//           startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
//           endAdornment: (
//             <InputAdornment position="end">
//               <IconButton
//                 aria-label="toggle password visibility"
//                 onClick={handleClickShowPassword}
//                 onMouseDown={handleMouseDownPassword}
//                 edge="end"
//               >
//                 {showPassword ? <VisibilityOff /> : <Visibility />}
//               </IconButton>
//             </InputAdornment>
//           ),
//         }}
//       />
//       <TextField
//         margin="normal"
//         required
//         fullWidth
//         name="confirmPassword"
//         label="Confirm Password"
//         type={showPassword ? 'text' : 'password'}
//         id="confirmPassword"
//         autoComplete="new-password"
//         value={confirmPassword}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         InputProps={{
//           startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
//         }}
//       />
//       <Button
//         type="submit"
//         fullWidth
//         variant="contained"
//         sx={{ mt: 3, mb: 2 }}
//         disabled={loading}
//       >
//         {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Password'}
//       </Button>
//     </Box>
//   );
// };

// export default CreatePasswordForm;


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

const CreatePasswordForm = ({ userIdentifier, onPasswordCreated, onError }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

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
        Create Password
      </Typography>
      
      <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
        Create a secure password for your account
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
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
          label="Confirm Password"
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
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none'
            }
          }}
          disabled={loading || !password || password !== confirmPassword}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Set Password'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CreatePasswordForm;