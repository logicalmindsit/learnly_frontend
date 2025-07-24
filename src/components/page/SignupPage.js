import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StepperComponent from '../auth/common/StepperComponent';
import RegisterForm from '../auth/RegisterForm';
import VerifyOtpForm from '../auth/VerifyOtpForm';
import CreatePasswordForm from '../auth/CreatePasswordForm';
import ProfileForm from '../auth/ProfileForm';
import AuthLayout from '../auth/common/AuthLayout';
import authService from '../services/authService';
import { Box, Link as MuiLink, Typography } from '@mui/material';

const steps = ['Account Setup', 'Verify OTP', 'Set Password', 'Profile Details'];

const SignupPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [userIdentifier, setUserIdentifier] = useState({ email: '', mobile: '' }); // To store email/mobile across steps
  const navigate = useNavigate();

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  // const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1); // If needed

  const showToastError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showToastSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  
  // Step 1: Register
  const handleRegister = async (data) => {
    try {
      const response = await authService.register(data);
      setUserIdentifier(data); // Store email/mobile
      showToastSuccess(response.data.message || "OTP Sent! Check your device.");
      handleNext();
    } catch (error) {
      showToastError(error.response?.data?.message || "Registration failed.");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (data) => {
    try {
      const response = await authService.verifyOtp(data);
      showToastSuccess(response.data.message || "OTP Verified Successfully!");
      handleNext();
    } catch (error) {
      showToastError(error.response?.data?.message || "OTP verification failed.");
    }
  };

  // Step 3: Create Password
  const handleCreatePassword = async (data) => {
    try {
      const response = await authService.createPassword(data);
      showToastSuccess(response.data.message || "Password created successfully!");
      handleNext();
    } catch (error) {
      showToastError(error.response?.data?.message || "Password creation failed.");
    }
  };

  // Step 4: Save Profile
  const handleSaveProfile = async (formDataPayload, identifier) => {
    // The authService.saveProfileData will append email/mobile from `identifier` to formDataPayload
    try {
      const response = await authService.saveProfileData(formDataPayload, identifier);
      showToastSuccess(response.data.message || "Profile saved! Signup complete.");
      // Optionally, you can show a final success popup for a few seconds
      toast.info("Redirecting to login...", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate('/login')
      });
    } catch (error) {
      showToastError(error.response?.data?.message || "Failed to save profile.");
    }
  };


  const handleResendOtp = async (userIdentifier) => {
    try {
      console.log('Resending OTP for:', userIdentifier);
      const response = await authService.resendOtp(userIdentifier);
      
      if (response.data.success) {
        showToastSuccess(response.data.message || 'New OTP sent successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      showToastError(error.response?.data?.message || error.message || 'Failed to resend OTP. Please try again.');
      throw error; // Re-throw to let the component handle it
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <RegisterForm onRegisterSuccess={handleRegister} onError={showToastError} />;
      case 1:
        return <VerifyOtpForm 
          userIdentifier={userIdentifier} 
          onOtpVerified={handleVerifyOtp} 
          onError={showToastError}
          onResendOtp={handleResendOtp}
        />;
      case 2:
        return <CreatePasswordForm userIdentifier={userIdentifier} onPasswordCreated={handleCreatePassword} onError={showToastError}/>;
      case 3:
        return <ProfileForm userIdentifier={userIdentifier} onProfileSaved={handleSaveProfile} onError={showToastError}/>;
      default:
        return 'Unknown step';
    }
  };

  return (
    <AuthLayout title="Create Your Account">
      <StepperComponent activeStep={activeStep} steps={steps} />
      <Box>
        {getStepContent(activeStep)}
      </Box>
       <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Already have an account?{' '}
        <MuiLink component="button" variant="body2" onClick={() => navigate('/login')}>
          Login here
        </MuiLink>
      </Typography>
    </AuthLayout>
  );
};

export default SignupPage;