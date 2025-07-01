// src/Layout.js
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // Outlet renders child routes
import Header from './Header';
import Footer from './Footer';

// Material UI Components for Modals
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Link as MuiLink,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Toast Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Form Components (Ensure these paths are correct relative to src/Layout.js)
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import VerifyOtpForm from '../../components/auth/VerifyOtpForm';
import CreatePasswordForm from '../../components/auth/CreatePasswordForm';
import ProfileForm from '../../components/auth/ProfileForm'; // ProfileForm might be better in a protected route
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import VerifyForgotPasswordOtpForm from '../../components/auth/VerifyForgotPasswordOtpForm';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';
import StepperComponent from '../../components/auth/common/StepperComponent'; // Common Stepper

// Auth Service (Ensure path is correct relative to src/Layout.js)
import authService from '../../components/services/authService';

// Auth Context (Ensure path is correct relative to src/Layout.js)
import { useAuth } from '../../Context/AuthContext';

// Color Palette and Font (Centralized or shared)
const theme = {
    colors: {
        primary: '#0862F7',
        secondary: '#0A033C',
        text: '#696984',
        green: '#22C55E',
        lightBlueBg: '#F0F6FF',
        lightGrayBg: '#F7F8FA',
        white: '#FFFFFF',
        border: '#E9EAF0',
        yellow: '#FFC221',
    },
    font: "'Poppins', sans-serif",
};
// Pass theme to Header and Footer if needed, or define it centrally and import

// --- MODAL COMPONENTS (Moved into Layout as they are controlled here) ---

// Login Modal
const LoginModal = ({ open, onClose, onSwitchToSignup, onSwitchToForgotPassword }) => {
    // LoginForm itself contains useNavigate for redirection after successful login
    // Pass theme styles if needed inside forms
    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '12px', width: '100%', maxWidth: '450px', m: 2 } }} >
            <DialogTitle sx={{ fontWeight: '600', pb: 1 }}>
                Welcome Back!
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {/* LoginForm is expected to handle its own submission logic and navigation on success */}
                <LoginForm onLoginSuccess={onClose} /> {/* Close modal on success */}
                <Typography variant="body2" align="center" sx={{ mt: 2.5, color: 'text.secondary' }}>
                    Don't have an account?{' '}
                    <MuiLink component="button" variant="body2" onClick={onSwitchToSignup} sx={{ fontWeight: '500' }}>
                        Sign up here
                    </MuiLink>
                </Typography>
                <Typography variant="body2" align="center" sx={{ mt: 1, color: 'text.secondary' }}>
                    <MuiLink component="button" variant="body2" onClick={onSwitchToForgotPassword} sx={{ fontWeight: '500' }}>
                        Forgot Password?
                    </MuiLink>
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

// Signup Modal
const SignupModal = ({ open, onClose, onSwitchToLogin }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [userIdentifier, setUserIdentifier] = useState({ email: '', mobile: '' });
    // useNavigate is used *within* the forms, not here

    const steps = ['Account Setup', 'Verify OTP', 'Set Password', 'Profile Details'];

    const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);

    const resetModal = () => {
        setActiveStep(0);
        setUserIdentifier({ email: '', mobile: '' });
        onClose();
    };

    const showToastError = (message) => toast.error(message, { position: "top-right" });
    const showToastSuccess = (message) => toast.success(message, { position: "top-right" });

    const handleRegister = async (data) => {
        try {
            const response = await authService.register(data);
            setUserIdentifier(data); // Capture identifier for next steps
            showToastSuccess(response.data.message || "OTP Sent! Check your device.");
            handleNext();
        } catch (error) {
            showToastError(error.response?.data?.message || "Registration failed.");
        }
    };

    const handleVerifyOtp = async (data) => {
        try {
             // Combine identifier with OTP data for the service call
            const payload = { ...userIdentifier, ...data };
            const response = await authService.verifyOtp(payload);
            showToastSuccess(response.data.message || "OTP Verified Successfully!");
            handleNext();
        } catch (error) {
            showToastError(error.response?.data?.message || "OTP verification failed.");
        }
    };

    const handleCreatePassword = async (data) => {
        try {
             // Combine identifier with password data for the service call
            const payload = { ...userIdentifier, ...data };
            const response = await authService.createPassword(payload);
            showToastSuccess(response.data.message || "Password created successfully!");
            handleNext(); // Move to Profile Step
        } catch (error) {
            showToastError(error.response?.data?.message || "Password creation failed.");
        }
    };

     const handleSaveProfile = async (formDataPayload) => {
         try {
             // ProfileForm usually handles file uploads (multipart/form-data)
             // userIdentifier is needed to identify which user's profile to save
             const response = await authService.saveProfileData(formDataPayload, userIdentifier);
             showToastSuccess(response.data.message || "Profile saved! Signup complete.");
             toast.info("Redirecting to login...", {
                 position: "top-center", autoClose: 2000,
                 onClose: () => {
                     resetModal(); // Close signup modal
                     onSwitchToLogin(); // Open login modal
                 }
             });
         } catch (error) {
             showToastError(error.response?.data?.message || "Failed to save profile.");
         }
     };


    const getStepContent = (step) => {
        switch (step) {
            // Pass handlers to forms for progression/actions
            case 0: return <RegisterForm onRegisterSuccess={handleRegister} onError={showToastError} />;
            case 1: return <VerifyOtpForm onOtpVerified={handleVerifyOtp} onError={showToastError} userIdentifier={userIdentifier} />;
            case 2: return <CreatePasswordForm onPasswordCreated={handleCreatePassword} onError={showToastError} userIdentifier={userIdentifier} />;
            case 3: return <ProfileForm onProfileSaved={handleSaveProfile} onError={showToastError} userIdentifier={userIdentifier} />;
            default: return 'Unknown step';
        }
    };

    return (
        <Dialog open={open} onClose={resetModal} PaperProps={{ sx: { borderRadius: '12px', width: '100%', maxWidth: '750px', m: 2 } }}>
            <DialogTitle sx={{ fontWeight: '600', pb: 1 }}>
                Create Your Account
                <IconButton onClick={resetModal} sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <StepperComponent activeStep={activeStep} steps={steps} />
                <Box sx={{ mt: 2, mb: 1, minHeight: '250px' /* Adjust as needed */ }}>{getStepContent(activeStep)}</Box>
                <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
                    Already have an account?{' '}
                    <MuiLink component="button" variant="body2" onClick={() => { resetModal(); onSwitchToLogin(); }} sx={{ fontWeight: '500' }}>
                        Login here
                    </MuiLink>
                </Typography>
            </DialogContent>
        </Dialog>
    );
};


// Forgot Password Modal
const ForgotPasswordModal = ({ open, onClose, onSwitchToLogin }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [userIdentifier, setUserIdentifier] = useState({ email: '', mobile: '' });
    // useNavigate is used *within* forms

    const steps = ['Request OTP', 'Verify OTP', 'Reset Password'];

    const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);

    const resetModal = () => {
        setActiveStep(0);
        setUserIdentifier({ email: '', mobile: '' });
        onClose();
    };

    const showToastError = (message) => toast.error(message, { position: "top-right" });
    const showToastSuccess = (message) => toast.success(message, { position: "top-right" });

    const handleOtpRequested = async (data) => {
        try {
            const response = await authService.forgotPasswordRequest(data);
            setUserIdentifier(data); // Capture identifier for next steps
            showToastSuccess(response.data.message || "OTP Sent for password reset.");
            handleNext();
        } catch (error) {
            showToastError(error.response?.data?.message || "Failed to send OTP.");
        }
    };

    const handleOtpVerified = async (data) => {
        try {
             // Combine identifier with OTP data for the service call
            const payload = { ...userIdentifier, ...data };
            const response = await authService.verifyForgotPasswordOtp(payload);
            showToastSuccess(response.data.message || "OTP Verified Successfully!");
            handleNext();
        } catch (error) {
            showToastError(error.response?.data?.message || "OTP verification failed.");
        }
    };

    const handlePasswordReset = async (data) => {
        try {
             // Combine identifier with new password data for the service call
             const payload = { ...userIdentifier, ...data };
            const response = await authService.resetPassword(payload);
            showToastSuccess(response.data.message || "Password reset successfully!");
            toast.info("Redirecting to login...", {
                position: "top-center", autoClose: 2000,
                onClose: () => {
                    resetModal(); // Close forgot password modal
                    onSwitchToLogin(); // Open login modal
                }
            });
        } catch (error) {
            showToastError(error.response?.data?.message || "Password reset failed.");
        }
    };

    const getStepContent = (step) => {
        switch (step) {
             // Pass handlers to forms for progression/actions
            case 0: return <ForgotPasswordForm onOtpRequested={handleOtpRequested} onError={showToastError} />;
            case 1: return <VerifyForgotPasswordOtpForm onOtpVerified={handleOtpVerified} onError={showToastError} userIdentifier={userIdentifier} />;
            case 2: return <ResetPasswordForm onPasswordReset={handlePasswordReset} onError={showToastError} userIdentifier={userIdentifier} />;
            default: return 'Unknown step';
        }
    };

    return (
        <Dialog open={open} onClose={resetModal} PaperProps={{ sx: { borderRadius: '12px', width: '100%', maxWidth: '550px', m: 2 } }}>
            <DialogTitle sx={{ fontWeight: '600', pb: 1 }}>
                Forgot Your Password?
                 <IconButton onClick={resetModal} sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <StepperComponent activeStep={activeStep} steps={steps} />
                <Box sx={{ mt: 2, mb: 1, minHeight: '200px' /* Adjust as needed */ }}>{getStepContent(activeStep)}</Box>
                <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
                    Remembered your password?{' '}
                    <MuiLink component="button" variant="body2" onClick={() => { resetModal(); onSwitchToLogin(); }} sx={{ fontWeight: '500' }}>
                        Login here
                    </MuiLink>
                </Typography>
            </DialogContent>
        </Dialog>
    );
};


// --- MAIN LAYOUT COMPONENT ---
const Layout = () => {
    // Modal States
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [signupModalOpen, setSignupModalOpen] = useState(false);
    const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

    // Handlers to open/close modals
    const handleOpenLogin = () => setLoginModalOpen(true);
    const handleCloseLogin = () => setLoginModalOpen(false);

    const handleOpenSignup = () => setSignupModalOpen(true);
    const handleCloseSignup = () => setSignupModalOpen(false);

    const handleOpenForgotPassword = () => setForgotPasswordModalOpen(true);
    const handleCloseForgotPassword = () => setForgotPasswordModalOpen(false);

    // Handlers to switch between modals
    const switchToSignup = () => {
        handleCloseLogin();
        handleCloseForgotPassword(); // Just in case
        handleOpenSignup();
    };

    const switchToLogin = () => {
        handleCloseSignup();
        handleCloseForgotPassword();
        handleOpenLogin();
    };

    const switchToForgotPassword = () => {
        handleCloseLogin(); // Typically from login modal
        handleOpenForgotPassword();
    };


    return (
        <div style={{ fontFamily: theme.font, backgroundColor: theme.colors.white }}>
             <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            {/* Header is always visible */}
            <Header onLoginClick={handleOpenLogin} theme={theme} />

            {/* Main content area changes based on route */}
            <main style={{ minHeight: '80vh' /* Ensure footer is pushed down */ }}>
                <Outlet /> {/* This is where HomePageContent (or other page components) will render */}
            </main>

            {/* Footer is always visible */}
            <Footer theme={theme} />

            {/* Render Modals */}
            <LoginModal
                open={loginModalOpen}
                onClose={handleCloseLogin}
                onSwitchToSignup={switchToSignup}
                onSwitchToForgotPassword={switchToForgotPassword}
            />
            <SignupModal
                open={signupModalOpen}
                onClose={handleCloseSignup}
                onSwitchToLogin={switchToLogin}
            />
            <ForgotPasswordModal
                open={forgotPasswordModalOpen}
                onClose={handleCloseForgotPassword}
                onSwitchToLogin={switchToLogin}
            />
        </div>
    );
};

export default Layout;