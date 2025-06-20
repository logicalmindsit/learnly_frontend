import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Typography, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const RegisterForm = ({ onRegisterSuccess, onError }) => {
  const [formData, setFormData] = useState({ email: '', mobile: '' });
  const [registerWith, setRegisterWith] = useState('email'); // 'email' or 'mobile'
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterTypeChange = (e) => {
    setRegisterWith(e.target.value);
    setFormData({ email: '', mobile: '' }); // Reset fields on type change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = registerWith === 'email' ? { email: formData.email } : { mobile: formData.mobile };
      if (registerWith === 'email' && !formData.email) {
        onError("Email is required.");
        setLoading(false);
        return;
      }
      if (registerWith === 'mobile' && !formData.mobile) {
        onError("Mobile number is required.");
        setLoading(false);
        return;
      }
      // Basic frontend validation (backend does more thorough)
      if (registerWith === 'email' && !/\S+@\S+\.\S+/.test(formData.email)) {
          onError("Invalid email format.");
          setLoading(false);
          return;
      }
      if (registerWith === 'mobile' && !/^\+\d{1,3}\d{7,15}$/.test(formData.mobile)) {
          onError("Invalid mobile format. Include country code e.g., +1234567890");
          setLoading(false);
          return;
      }

      onRegisterSuccess(payload); // Pass payload to parent (SignupPage)
    } catch (err) {
      // This catch is usually for network errors, service.js handles API errors
      onError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">Register with:</FormLabel>
        <RadioGroup row name="registerType" value={registerWith} onChange={handleRegisterTypeChange}>
          <FormControlLabel value="email" control={<Radio />} label="Email" />
          <FormControlLabel value="mobile" control={<Radio />} label="Mobile" />
        </RadioGroup>
      </FormControl>

      {registerWith === 'email' && (
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
          InputProps={{
            startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />
      )}
      {registerWith === 'mobile' && (
        <TextField
          margin="normal"
          required
          fullWidth
          id="mobile"
          label="Mobile Number (with country code)"
          name="mobile"
          autoComplete="tel"
          placeholder="+1234567890"
          value={formData.mobile}
          onChange={handleChange}
          InputProps={{
            startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />
      )}
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



// import React, { useState } from 'react';
// import { 
//   Box, 
//   TextField, 
//   Button, 
//   CircularProgress, 
//   Typography, 
//   RadioGroup, 
//   FormControlLabel, 
//   Radio, 
//   FormLabel, 
//   FormControl,
//   Paper,
//   Divider
// } from '@mui/material';
// import EmailIcon from '@mui/icons-material/Email';
// import PhoneIcon from '@mui/icons-material/Phone';

// const RegisterForm = ({ onRegisterSuccess, onError }) => {
//   const [formData, setFormData] = useState({ email: '', mobile: '' });
//   const [registerWith, setRegisterWith] = useState('email');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRegisterTypeChange = (e) => {
//     setRegisterWith(e.target.value);
//     setFormData({ email: '', mobile: '' });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const payload = registerWith === 'email' ? { email: formData.email } : { mobile: formData.mobile };
      
//       // Validation checks remain the same...
      
//       onRegisterSuccess(payload);
//     } catch (err) {
//       onError(err.message || 'Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Paper elevation={3} sx={{ 
//       maxWidth: 450,
//       mx: 'auto',
//       p: 4,
//       borderRadius: 3,
//       boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.08)'
//     }}>
//       <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ 
//         fontWeight: 600,
//         color: 'primary.main',
//         mb: 2
//       }}>
//         Create Account
//       </Typography>
      
//       <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
//         Get started by registering with your email or mobile
//       </Typography>
      
//       <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//         <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
//           <RadioGroup 
//             row 
//             name="registerType" 
//             value={registerWith} 
//             onChange={handleRegisterTypeChange}
//             sx={{ justifyContent: 'center', gap: 3 }}
//           >
//             <FormControlLabel 
//               value="email" 
//               control={<Radio color="primary" />} 
//               label={
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <EmailIcon sx={{ mr: 1 }} />
//                   <Typography>Email</Typography>
//                 </Box>
//               } 
//             />
//             <FormControlLabel 
//               value="mobile" 
//               control={<Radio color="primary" />} 
//               label={
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <PhoneIcon sx={{ mr: 1 }} />
//                   <Typography>Mobile</Typography>
//                 </Box>
//               } 
//             />
//           </RadioGroup>
//         </FormControl>

//         {registerWith === 'email' ? (
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="email"
//             label="Email Address"
//             name="email"
//             autoComplete="email"
//             autoFocus
//             value={formData.email}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//             InputProps={{
//               startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
//             }}
//           />
//         ) : (
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="mobile"
//             label="Mobile Number"
//             name="mobile"
//             autoComplete="tel"
//             placeholder="+1234567890"
//             value={formData.mobile}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//             InputProps={{
//               startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />,
//             }}
//           />
//         )}
        
//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           size="large"
//           sx={{ 
//             mt: 2, 
//             mb: 3,
//             py: 1.5,
//             borderRadius: 2,
//             fontSize: '1rem',
//             fontWeight: 600,
//             textTransform: 'none',
//             boxShadow: 'none',
//             '&:hover': {
//               boxShadow: 'none',
//               transform: 'translateY(-1px)',
//               transition: 'transform 0.2s'
//             }
//           }}
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Verification Code'}
//         </Button>
        
//         {/* <Divider sx={{ my: 2 }}>or</Divider>
        
//         <Box sx={{ textAlign: 'center', mt: 2 }}>
//           <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//             Already have an account?{' '}
//             <Button href="/login" variant="text" size="small" sx={{ fontWeight: 600 }}>
//               Sign in
//             </Button>
//           </Typography>
//         </Box> */}
//       </Box>
//     </Paper>
//   );
// };

// export default RegisterForm;