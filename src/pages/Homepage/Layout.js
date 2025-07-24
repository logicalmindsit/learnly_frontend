
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; 
import Footer from './Footer'; 

// Material UI Components for Modals
import {
    Dialog,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Link as MuiLink,
    useMediaQuery,
    useTheme as useMuiTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Toast Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Form Components
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import VerifyOtpForm from '../../components/auth/VerifyOtpForm';
import CreatePasswordForm from '../../components/auth/CreatePasswordForm';
import ProfileForm from '../../components/auth/ProfileForm';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import VerifyForgotPasswordOtpForm from '../../components/auth/VerifyForgotPasswordOtpForm';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';
import StepperComponent from '../../components/auth/common/StepperComponent';

// Auth Service
import authService from '../../components/services/authService';

// Auth Context
import { useAuth } from '../../Context/AuthContext';

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

// --- MODAL COMPONENTS ---

const LoginModal = ({ open, onClose, onSwitchToSignup, onSwitchToForgotPassword }) => {
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{ sx: { borderRadius: '12px', m: 2, maxWidth: '900px' } }}
        >
            <IconButton 
                onClick={onClose} 
                sx={{ position: 'absolute', right: 8, top: 8, zIndex: 10, color: 'grey.500' }}
            >
                <CloseIcon />
            </IconButton>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' } }}>

                <Box 
                    sx={{ 
                        width: { xs: '100%', sm: '50%' },
                        p: { xs: 3, sm: 4 },
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center' 
                    }}
                >
                    <LoginForm onLoginSuccess={onClose} onSwitchToForgotPassword={onSwitchToForgotPassword} />
                    
                    <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                        Don't have an account?{' '}
                        <MuiLink 
                            component="button" 
                            variant="body2" 
                            onClick={onSwitchToSignup} 
                            sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                        >
                            Sign Up
                        </MuiLink>
                    </Typography>
                </Box>

                <Box 
                    sx={{ 
                        width: { xs: '100%', sm: '50%' },
                        height: { xs: '250px', sm: 'auto' },
                    }}
                >
                    <Box
                        component="img"
                        src="/yoga2.jpg"
                        alt="Woman doing yoga"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderTopLeftRadius: { xs: '12px', sm: 0 },
                            borderTopRightRadius: { xs: '12px', sm: 0 },
                        }}
                    />
                </Box>
                
            </Box>
        </Dialog>
    );
};

const SignupModal = ({ open, onClose, onSwitchToLogin }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [userIdentifier, setUserIdentifier] = useState({ email: '', mobile: '' });
    const [registrationStatus, setRegistrationStatus] = useState(null);
    const [isSignupCompleted, setIsSignupCompleted] = useState(false); // Track signup completion
    const steps = ['Account Setup', 'Verify OTP', 'Set Password', 'Profile Details'];
    
    const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const resetModal = () => { 
        setActiveStep(0); 
        setUserIdentifier({ email: '', mobile: '' }); 
        setRegistrationStatus(null);
        setIsSignupCompleted(false); // Reset completion status
        onClose(); 
    };
    const showToastError = (message) => toast.error(message, { position: "top-right" });
    const showToastSuccess = (message) => toast.success(message, { position: "top-right" });

    // Handle existing user - check their registration status
    const handleExistingUser = async (data) => {
        try {
            const statusResponse = await authService.checkRegistrationStatus(data);
            const status = statusResponse.data;
            
            if (status.registrationComplete) {
                // User has completed registration
                showToastError("Account already exists. Please login instead.");
                setTimeout(() => {
                    resetModal();
                    onSwitchToLogin();
                }, 2000);
            } else {
                // User has pending registration - continue from where they left off
                setUserIdentifier(data);
                setRegistrationStatus(status);
                
                if (status.step === 'otp_pending') {
                    setActiveStep(1); // Go to OTP verification
                    showToastSuccess("Continuing your pending registration. Please verify OTP.");
                } else if (status.step === 'password_pending') {
                    setActiveStep(2); // Go to password creation
                    showToastSuccess("Continuing your pending registration. Please set your password.");
                } else if (status.step === 'profile_pending') {
                    setActiveStep(3); // Go to profile completion
                    showToastSuccess("Continuing your pending registration. Please complete your profile.");
                } else {
                    // Default to OTP step if status is unclear
                    setActiveStep(1);
                    showToastSuccess("Continuing your pending registration. Please verify OTP.");
                }
            }
        } catch (statusError) {
            // If status check fails, show the original error
            showToastError("This email is already registered. Please use a different email or login instead.");
        }
    };

    const handleRegister = async (data) => { 
        try { 
            const response = await authService.register(data); 
            setUserIdentifier(data); 
            showToastSuccess(response.data.message || "OTP Sent! Check your device."); 
            handleNext(); 
        } catch (error) { 
            // If user already exists, check their registration status
            if (error.response?.status === 409 || 
                error.response?.data?.message?.toLowerCase().includes('already exists') ||
                error.response?.data?.message?.toLowerCase().includes('user already')) {
                
                await handleExistingUser(data);
            } else {
                showToastError(error.response?.data?.message || "Registration failed."); 
            }
        } 
    };
    const handleVerifyOtp = async (data) => { try { const payload = { ...userIdentifier, ...data }; const response = await authService.verifyOtp(payload); showToastSuccess(response.data.message || "OTP Verified Successfully!"); handleNext(); } catch (error) { showToastError(error.response?.data?.message || "OTP verification failed."); } };
    const handleResendOtp = async (userIdentifier) => { try { console.log('Resending OTP for:', userIdentifier); const response = await authService.resendOtp(userIdentifier); if (response.data.success) { showToastSuccess(response.data.message || 'New OTP sent successfully!'); } else { throw new Error(response.data.message || 'Failed to resend OTP'); } } catch (error) { console.error('Resend OTP Error:', error); showToastError(error.response?.data?.message || error.message || 'Failed to resend OTP. Please try again.'); throw error; } };
    const handleCreatePassword = async (data) => { try { const payload = { ...userIdentifier, ...data }; const response = await authService.createPassword(payload); showToastSuccess(response.data.message || "Password created successfully!"); handleNext(); } catch (error) { showToastError(error.response?.data?.message || "Password creation failed."); } };
    const handleSaveProfile = async (formDataPayload) => { 
        try { 
            const response = await authService.saveProfileData(formDataPayload, userIdentifier); 
            showToastSuccess(response.data.message || "Profile saved! Signup complete."); 
            setIsSignupCompleted(true); // Mark signup as completed
            toast.info("Signup completed successfully! You can now close this window.", { 
                position: "top-center", 
                autoClose: 3000,
                onClose: () => { 
                    resetModal(); 
                    onSwitchToLogin(); 
                } 
            }); 
        } catch (error) { 
            showToastError(error.response?.data?.message || "Failed to save profile."); 
        } 
    };
    
    const getStepContent = (step) => { 
        switch (step) { 
            case 0: return <RegisterForm onRegisterSuccess={handleRegister} onError={showToastError} />; 
            case 1: return <VerifyOtpForm onOtpVerified={handleVerifyOtp} onError={showToastError} userIdentifier={userIdentifier} onResendOtp={handleResendOtp} />; 
            case 2: return <CreatePasswordForm onPasswordCreated={handleCreatePassword} onError={showToastError} userIdentifier={userIdentifier} />; 
            case 3: return <ProfileForm onProfileSaved={handleSaveProfile} onError={showToastError} userIdentifier={userIdentifier} />; 
            default: return 'Unknown step'; 
        } 
    };

    // Handle close button click - only allow if signup is completed
    const handleCloseAttempt = () => {
        if (isSignupCompleted) {
            resetModal();
        } else {
            showToastError("Please complete the signup process before closing.");
        }
    };

    return ( 
        <Dialog 
            open={open} 
            onClose={isSignupCompleted ? resetModal : undefined} // Only allow dialog close if completed
            disableEscapeKeyDown={!isSignupCompleted} // Disable ESC key if not completed
            PaperProps={{ sx: { 
                borderRadius: '16px', 
                width: '100%', 
                maxWidth: activeStep === 3 ? '750px' : '500px', // Wider for profile step
                m: 2,
                transition: 'max-width 0.3s ease-in-out', // Smooth transition for size change
            }}}
        > 
            <IconButton 
                onClick={handleCloseAttempt}
                disabled={!isSignupCompleted} // Disable close button if signup not completed
                sx={{ 
                    position: 'absolute', 
                    right: 12, 
                    top: 12, 
                    color: isSignupCompleted ? (theme) => theme.palette.grey[500] : (theme) => theme.palette.grey[300],
                    cursor: isSignupCompleted ? 'pointer' : 'not-allowed',
                    opacity: isSignupCompleted ? 1 : 0.5,
                    '&:hover': {
                        backgroundColor: isSignupCompleted ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                    }
                }}
                title={isSignupCompleted ? "Close" : "Complete signup to close"}
            > 
                <CloseIcon /> 
            </IconButton>

            <DialogContent sx={{ p: { xs: 2, sm: 4 } }}> 
                <Typography variant="h4" sx={{ 
                    fontWeight: '700', 
                    pb: 1, 
                    textAlign: 'center',
                    color: '#007BFF', // Blue color for header
                    mb: 2,
                }}> 
                    Create Account 
                </Typography> 

                {isSignupCompleted && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                        <Typography variant="body2" color="success.contrastText" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                            ✅ Signup completed successfully! You can now close this window.
                        </Typography>
                    </Box>
                )}

                {registrationStatus && !isSignupCompleted && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                        <Typography variant="body2" color="info.contrastText" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                            📋 Resuming your pending registration...
                        </Typography>
                        <Typography variant="body2" color="info.contrastText" sx={{ textAlign: 'center', mt: 0.5 }}>
                            {registrationStatus.step === 'otp_pending' && 'Please verify the OTP sent to your email/phone'}
                            {registrationStatus.step === 'password_pending' && 'Please create a secure password for your account'}
                            {registrationStatus.step === 'profile_pending' && 'Please complete your profile information'}
                        </Typography>
                    </Box>
                )}
                
                <StepperComponent activeStep={activeStep} steps={steps} /> 
                
                <Box sx={{ mt: 2, mb: 1, minHeight: '250px' }}>
                    {getStepContent(activeStep)}
                </Box> 
                
                {(activeStep > 0 || registrationStatus) && !isSignupCompleted && (
                    <Typography variant="body2" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
                        ⚠️ Please complete all steps before closing the window.
                    </Typography>
                )}
                
                <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}> 
                    Already have an account?{' '} 
                    <MuiLink 
                        component="button" 
                        variant="body2" 
                        onClick={() => { resetModal(); onSwitchToLogin(); }} 
                        sx={{ fontWeight: 'bold', color: '#007BFF' }}
                    > 
                        Login
                    </MuiLink> 
                </Typography> 
            </DialogContent> 
        </Dialog> 
    );
};

const ForgotPasswordModal = ({ open, onClose, onSwitchToLogin }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [userIdentifier, setUserIdentifier] = useState({ email: '', mobile: '' });
    const steps = ['Request OTP', 'Verify OTP', 'Reset Password'];
    const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const resetModal = () => { setActiveStep(0); setUserIdentifier({ email: '', mobile: '' }); onClose(); };
    const showToastError = (message) => toast.error(message, { position: "top-right" });
    const showToastSuccess = (message) => toast.success(message, { position: "top-right" });
    const handleOtpRequested = async (data) => { try { const response = await authService.forgotPasswordRequest(data); setUserIdentifier(data); showToastSuccess(response.data.message || "OTP Sent for password reset."); handleNext(); } catch (error) { showToastError(error.response?.data?.message || "Failed to send OTP."); } };
    const handleOtpVerified = async (data) => { try { const payload = { ...userIdentifier, ...data }; const response = await authService.verifyForgotPasswordOtp(payload); showToastSuccess(response.data.message || "OTP Verified Successfully!"); handleNext(); } catch (error) { showToastError(error.response?.data?.message || "OTP verification failed."); } };
    const handlePasswordReset = async (data) => { try { const payload = { ...userIdentifier, ...data }; const response = await authService.resetPassword(payload); showToastSuccess(response.data.message || "Password reset successfully!"); toast.info("Redirecting to login...", { position: "top-center", autoClose: 2000, onClose: () => { resetModal(); onSwitchToLogin(); } }); } catch (error) { showToastError(error.response?.data?.message || "Password reset failed."); } };
    const getStepContent = (step) => { switch (step) { case 0: return <ForgotPasswordForm onOtpRequested={handleOtpRequested} onError={showToastError} />; case 1: return <VerifyForgotPasswordOtpForm onOtpVerified={handleOtpVerified} onError={showToastError} userIdentifier={userIdentifier} />; case 2: return <ResetPasswordForm onPasswordReset={handlePasswordReset} onError={showToastError} userIdentifier={userIdentifier} />; default: return 'Unknown step'; } };
    return ( <Dialog open={open} onClose={resetModal} PaperProps={{ sx: { borderRadius: '12px', width: '100%', maxWidth: '550px', m: 2 } }}> <DialogContent> <Typography variant="h5" sx={{ fontWeight: '600', pb: 1, textAlign: 'center' }}> Forgot Your Password? <IconButton onClick={resetModal} sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}> <CloseIcon /> </IconButton> </Typography> <StepperComponent activeStep={activeStep} steps={steps} /> <Box sx={{ mt: 2, mb: 1, minHeight: '200px' }}>{getStepContent(activeStep)}</Box> <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}> Remembered your password?{' '} <MuiLink component="button" variant="body2" onClick={() => { resetModal(); onSwitchToLogin(); }} sx={{ fontWeight: '500' }}> Login here </MuiLink> </Typography> </DialogContent> </Dialog> );
};

const Layout = () => {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [signupModalOpen, setSignupModalOpen] = useState(false);
    const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

    const handleOpenLogin = () => setLoginModalOpen(true);
    const handleCloseLogin = () => setLoginModalOpen(false);
    const handleOpenSignup = () => setSignupModalOpen(true);
    const handleCloseSignup = () => setSignupModalOpen(false);
    const handleOpenForgotPassword = () => setForgotPasswordModalOpen(true);
    const handleCloseForgotPassword = () => setForgotPasswordModalOpen(false);

    const switchToSignup = () => {
        handleCloseLogin();
        handleCloseForgotPassword();
        handleOpenSignup();
    };
    const switchToLogin = () => {
        handleCloseSignup();
        handleCloseForgotPassword();
        handleOpenLogin();
    };
    const switchToForgotPassword = () => {
        handleCloseLogin();
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
            <Header onLoginClick={handleOpenLogin} theme={theme} />
            <main style={{ minHeight: '80vh' }}>
                <Outlet />
            </main>
            <Footer theme={theme} />
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