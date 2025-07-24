


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Using axios for easier API calls
import { useNavigate } from 'react-router-dom';

// API Base URL - configure this to your actual backend URL
const API_BASE_URL = 'https://learnly-backend-05ix.onrender.com'; // Example: Replace with your actual API base URL

// Default placeholder image (e.g., a generic avatar)
const DEFAULT_AVATAR = 'https://via.placeholder.com/150/CCCCCC/FFFFFF?Text=No+Image';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const fileInputRef = useRef(null);



  // Add CSS animation for spinner

  // Add CSS animation for spinner
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes backButtonSlide {
        from {
          opacity: 0;
          transform: translateX(-50px) scale(0.8);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
      
      .profile-card-animate {
        animation: fadeInUp 0.6s ease-out;
      }
      
      .profile-image-animate {
        animation: slideInLeft 0.8s ease-out;
      }
      
      .form-field-animate {
        animation: fadeInUp 0.4s ease-out;
      }
      
      .back-button-animate {
        animation: backButtonSlide 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .back-button-pulse {
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0% {
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        50% {
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5), 0 6px 15px rgba(0, 0, 0, 0.2);
        }
        100% {
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getToken = () => localStorage.getItem('token'); // Adjust 'authToken' if your key is different

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      const token = getToken();
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/profiles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setFormData({
          username: response.data.username || '',
          email: response.data.email || '',
          mobile: response.data.mobile || '',
          fatherName: response.data.fatherName || '',
          dateofBirth: response.data.dateofBirth ? new Date(response.data.dateofBirth).toISOString().split('T')[0] : '',
          gender: response.data.gender || '',
          bloodGroup: response.data.bloodGroup || '',
          Nationality: response.data.Nationality || '',
          Occupation: response.data.Occupation || '',
          address: {
            street: response.data.address?.street || '',
            city: response.data.address?.city || '',
            state: response.data.address?.state || '',
            country: response.data.address?.country || '',
            zipCode: response.data.address?.zipCode || '',
          },
        });
        setProfilePicturePreview(response.data.profilePicture?.url || DEFAULT_AVATAR);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile data.");
        console.error("Fetch profile error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setProfilePictureFile(file);
  //     setProfilePicturePreview(URL.createObjectURL(file));
  //   }
  // };
  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError("File size exceeds 5MB limit.");
      return;
    }
    setProfilePictureFile(file);
    setProfilePicturePreview(URL.createObjectURL(file));
    setError(''); // Clear any previous errors
  }
};

  const handleUpdateProfileDetails = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    const token = getToken();
    if (!token) {
      setError("Authentication token not found.");
      setIsLoading(false);
      return;
    }

    // Filter out empty address fields to avoid sending empty strings if not intended
    const payload = { ...formData };
    if (payload.address) {
        payload.address = Object.fromEntries(
            Object.entries(payload.address).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        );
        if (Object.keys(payload.address).length === 0) {
            delete payload.address;
        }
    }
     // Ensure dateofBirth is sent as null if empty, or a valid date string
    if (payload.dateofBirth === '') {
        payload.dateofBirth = null;
    }


    try {
      const response = await axios.put(`${API_BASE_URL}/putprofile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data.user);
       setFormData({ // Re-initialize formData with potentially validated/formatted data from backend
          username: response.data.user.username || '',
          email: response.data.user.email || '',
          mobile: response.data.user.mobile || '',
          fatherName: response.data.user.fatherName || '',
          dateofBirth: response.data.user.dateofBirth ? new Date(response.data.user.dateofBirth).toISOString().split('T')[0] : '',
          gender: response.data.user.gender || '',
          bloodGroup: response.data.user.bloodGroup || '',
          Nationality: response.data.user.Nationality || '',
          Occupation: response.data.user.Occupation || '',
          address: {
            street: response.data.user.address?.street || '',
            city: response.data.user.address?.city || '',
            state: response.data.user.address?.state || '',
            country: response.data.user.address?.country || '',
            zipCode: response.data.user.address?.zipCode || '',
          },
        });
      setSuccessMessage("Profile details updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile details.");
      console.error("Update details error:", err);
    } finally {
      setIsLoading(false);
    }
  };
const handleUpdateProfilePicture = async () => {
  if (!profilePictureFile) {
    setError("Please select a file to upload.");
    return;
  }
  setIsLoading(true);
  setError('');
  setSuccessMessage('');
  const token = getToken();
  if (!token) {
    setError("Authentication token not found.");
    setIsLoading(false);
    return;
  }

  const pictureFormData = new FormData();
  pictureFormData.append('profilePicture', profilePictureFile);

  try {
    const response = await axios.put(`${API_BASE_URL}/profile-picture`, pictureFormData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    setUserData(prev => ({ ...prev, profilePicture: response.data.profilePicture }));
    setProfilePicturePreview(response.data.profilePicture.url);
    setProfilePictureFile(null);
    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
    setSuccessMessage("Profile picture updated successfully!");
  } catch (err) {
    setError(err.response?.data?.message || "Failed to update profile picture.");
    console.error("Update picture error:", err);
  } finally {

    setIsLoading(false);
  }

    };

  // Handle back navigation
  const handleGoBack = () => {
    if (isEditing) {
      // If currently editing, show confirmation
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to go back?");
      if (confirmLeave) {
        setIsEditing(false);
        navigate(-1); // Go back to previous page
      }
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  // Modern Inline Styles with animations and mobile-first design
  const styles = {
    pageContainer: {
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: isMobileView ? '10px' : '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'auto',
    },
    backButton: {
      position: 'fixed',
      top: isMobileView ? '15px' : '20px',
      left: isMobileView ? '15px' : '20px',
      zIndex: 1000,
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: isMobileView ? '45px' : '50px',
      height: isMobileView ? '45px' : '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: isMobileView ? '18px' : '20px',
      fontWeight: '600',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
      ':hover': {
        transform: 'translateY(-2px) scale(1.05)',
        boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4), 0 6px 15px rgba(0, 0, 0, 0.15)',
      },
    },
    backButtonTooltip: {
      position: 'absolute',
      left: '60px',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      opacity: '0',
      visibility: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      '::after': {
        content: '""',
        position: 'absolute',
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        border: '5px solid transparent',
        borderRightColor: '#1f2937',
      },
    },
    profileCard: {
      backgroundColor: '#ffffff',
      borderRadius: isMobileView ? '16px' : '24px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: isMobileView ? '100%' : '1000px',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      margin: isMobileView ? '24px 0 10px 0' : '36px 0 20px 0', // Reduced top margin for less gap
    },
    cardHeader: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: isMobileView ? '20px 16px' : '30px 40px',
      fontSize: isMobileView ? '20px' : '28px',
      fontWeight: '700',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    editButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      color: 'white',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      padding: isMobileView ? '8px 12px' : '10px 20px',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: isMobileView ? '12px' : '14px',
      fontWeight: '600',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
      },
    },
    // editButtonHover (cannot do with inline, handle with JS if needed or simplify)
    cardBody: {
      padding: isMobileView ? '20px 16px' : '40px',
      display: 'flex',
      flexDirection: isMobileView ? 'column' : 'row',
      gap: isMobileView ? '25px' : '40px',
      backgroundColor: '#ffffff',
      position: 'relative',
    },
    pictureSection: {
      flex: isMobileView ? '1' : '0 0 280px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: isMobileView ? '0' : '20px',
      position: 'relative',
    },
    profileImage: {
      width: isMobileView ? '150px' : '200px',
      height: isMobileView ? '150px' : '200px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid transparent',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      backgroundClip: 'padding-box',
      boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3), 0 5px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      ':hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4), 0 8px 20px rgba(0, 0, 0, 0.15)',
      },
    },
    profileImageContainer: {
      position: 'relative',
      display: 'inline-block',
    },
    profileImageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    fileInput: {
      display: 'none',
    },
    uploadButton: {
      background: 'linear-gradient(135deg, #28a745, #20c997)',
      color: 'white',
      padding: isMobileView ? '12px 20px' : '14px 25px',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: isMobileView ? '13px' : '15px',
      fontWeight: '600',
      width: '100%',
      maxWidth: isMobileView ? '160px' : '200px',
      textAlign: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: '0 8px 20px rgba(40, 167, 69, 0.3)',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 30px rgba(40, 167, 69, 0.4)',
      },
    },
    detailsSection: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobileView ? '20px' : '25px',
      position: 'relative',
    },
    formRow: {
        display: 'flex',
        flexDirection: isMobileView ? 'column' : 'row',
        gap: isMobileView ? '15px' : '25px',
        marginBottom: '15px',
    },
    formField: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minWidth: isMobileView ? 'none' : '200px',
      position: 'relative',
    },
    label: {
      fontWeight: '600',
      fontSize: isMobileView ? '13px' : '14px',
      color: '#374151',
      marginBottom: '5px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    input: {
      padding: isMobileView ? '14px 16px' : '16px 20px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: isMobileView ? '14px' : '15px',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: '#f9fafb',
      fontFamily: 'inherit',
      ':focus': {
        outline: 'none',
        borderColor: '#667eea',
        backgroundColor: '#ffffff',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
        transform: 'translateY(-1px)',
      },
    },
    select: {
      padding: isMobileView ? '14px 16px' : '16px 20px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: isMobileView ? '14px' : '15px',
      backgroundColor: '#f9fafb',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: 'inherit',
      cursor: 'pointer',
      ':focus': {
        outline: 'none',
        borderColor: '#667eea',
        backgroundColor: '#ffffff',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
      },
    },
    textarea: {
        padding: isMobileView ? '14px 16px' : '16px 20px',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        fontSize: isMobileView ? '14px' : '15px',
        width: '100%',
        minHeight: isMobileView ? '100px' : '120px',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        backgroundColor: '#f9fafb',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        resize: 'vertical',
        ':focus': {
          outline: 'none',
          borderColor: '#667eea',
          backgroundColor: '#ffffff',
          boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
        },
    },
    infoText: {
      fontSize: isMobileView ? '14px' : '15px',
      color: '#6b7280',
      padding: isMobileView ? '12px 16px' : '15px 20px',
      backgroundColor: '#f9fafb',
      borderRadius: '10px',
      wordBreak: 'break-word',
      border: '1px solid #e5e7eb',
      fontWeight: '500',
    },
    infoGroup: {
        marginBottom: isMobileView ? '16px' : '20px',
        transition: 'all 0.3s ease',
    },
    infoLabel: {
        fontWeight: '700',
        fontSize: isMobileView ? '12px' : '13px',
        color: '#374151',
        display: 'block',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    actions: {
      marginTop: isMobileView ? '25px' : '40px',
      display: 'flex',
      flexDirection: isMobileView ? 'column' : 'row',
      gap: isMobileView ? '12px' : '20px',
      justifyContent: 'flex-end',
      paddingTop: '20px',
      borderTop: '1px solid #e5e7eb',
    },
    saveButton: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      padding: isMobileView ? '16px 24px' : '16px 32px',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: isMobileView ? '14px' : '16px',
      fontWeight: '600',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
      minWidth: isMobileView ? '100%' : 'auto',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
      },
    },
    cancelButton: {
      background: 'linear-gradient(135deg, #6b7280, #9ca3af)',
      color: 'white',
      padding: isMobileView ? '16px 24px' : '16px 32px',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: isMobileView ? '14px' : '16px',
      fontWeight: '600',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: '0 8px 20px rgba(107, 114, 128, 0.3)',
      minWidth: isMobileView ? '100%' : 'auto',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 30px rgba(107, 114, 128, 0.4)',
      },
    },
    loadingMessage: {
      textAlign: 'center',
      fontSize: isMobileView ? '16px' : '18px',
      color: '#374151',
      padding: isMobileView ? '40px 20px' : '60px',
      fontWeight: '600',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      margin: '20px',
    },
    message: {
      padding: isMobileView ? '16px 20px' : '20px 25px',
      margin: isMobileView ? '15px 10px' : '20px 0',
      borderRadius: '12px',
      textAlign: 'center',
      fontWeight: '600',
      fontSize: isMobileView ? '14px' : '15px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      border: '1px solid transparent',
      backdropFilter: 'blur(10px)',
    },
    errorMessage: {
      background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
      color: '#991b1b',
      border: '1px solid #f87171',
      boxShadow: '0 8px 25px rgba(248, 113, 113, 0.2)',
    },
    successMessage: {
      background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
      color: '#065f46',
      border: '1px solid #34d399',
      boxShadow: '0 8px 25px rgba(52, 211, 153, 0.2)',
    },
    studentId: {
        background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
        padding: isMobileView ? '12px 16px' : '16px 20px',
        borderRadius: '12px',
        fontSize: isMobileView ? '13px' : '14px',
        color: '#374151',
        fontWeight: '700',
        textAlign: 'center',
        margin: isMobileView ? '15px 10px 20px 10px' : '20px 0 25px 0',
        border: '2px solid #d1d5db',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    addressGroup: {
        padding: isMobileView ? '20px 16px' : '25px 20px',
        border: '2px solid #e5e7eb',
        borderRadius: '16px',
        marginTop: '15px',
        background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden',
    },
    addressTitle: {
        fontSize: isMobileView ? '16px' : '18px',
        fontWeight: '700',
        color: '#667eea',
        marginBottom: '15px',
        borderBottom: '2px solid #667eea',
        paddingBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '3px solid rgba(55, 65, 81, 0.3)',
      borderRadius: '50%',
      borderTopColor: '#667eea',
      animation: 'spin 1s ease-in-out infinite',
      marginRight: '10px',
    },
  };

  if (isLoading && !userData) { // Initial load
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingMessage}>
          <div style={styles.loadingSpinner}></div>
          Loading Your Profile...
        </div>
      </div>
    );
  }

  if (error && !userData) { // Critical error on initial load
    return <div style={{ ...styles.message, ...styles.errorMessage }}>{error}</div>;
  }

  if (!userData) { // Should not happen if loading and error are handled, but as a fallback
    return <div style={styles.loadingMessage}>No user data available.</div>;
  }

  return (
    <div style={styles.pageContainer}>
      {error && <div style={{ ...styles.message, ...styles.errorMessage }}>{error}</div>}
      {successMessage && <div style={{ ...styles.message, ...styles.successMessage }}>{successMessage}</div>}

      <div style={styles.profileCard} className="profile-card-animate">
        <div style={styles.cardHeader}>
          {/* Back Button near My Profile */}
          <button 
            style={{
              ...styles.backButton,
              position: 'static',
              marginRight: '18px',
              marginLeft: 0,
              boxShadow: 'none',
              top: undefined,
              left: undefined,
              width: isMobileView ? '38px' : '42px',
              height: isMobileView ? '38px' : '42px',
              fontSize: isMobileView ? '16px' : '18px',
              minWidth: 0,
            }}
            className="back-button-animate"
            onClick={handleGoBack}
            title="Go Back"
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
              e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4), 0 6px 15px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            ←
          </button>
          <span>👤 My Profile</span>
          {!isEditing && (
            <button style={styles.editButton} onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {userData.studentRegisterNumber && (
            <div style={styles.studentId}>
                Student ID: {userData.studentRegisterNumber}
            </div>
        )}

        <form onSubmit={handleUpdateProfileDetails}>
          <div style={styles.cardBody}>
            <div style={styles.pictureSection} className="profile-image-animate">
              <div style={styles.profileImageContainer}>
                <img
                  src={profilePicturePreview || userData.profilePicture?.url || DEFAULT_AVATAR}
                  alt="Profile"
                  style={styles.profileImage}
                />
                <div style={styles.profileImageOverlay}></div>
              </div>
              {isEditing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={styles.fileInput}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    style={styles.uploadButton}
                  >
                    📷 Change Photo
                  </button>
                  {profilePictureFile && (
                    <button
                      type="button"
                      onClick={handleUpdateProfilePicture}
                      style={{...styles.uploadButton, background: 'linear-gradient(135deg, #667eea, #764ba2)', marginTop: '10px'}}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span style={styles.loadingSpinner}></span>
                          Uploading...
                        </>
                      ) : (
                        '⬆️ Upload New Photo'
                      )}
                    </button>
                  )}
                </>
              )}
               {!isEditing && userData.profilePicture?.url && (
                 <p style={{fontSize: isMobileView ? '11px' : '12px', color: '#9ca3af', textAlign:'center', fontWeight: '500'}}>Current Profile Picture</p>
               )}
               {!isEditing && !userData.profilePicture?.url && (
                 <p style={{fontSize: isMobileView ? '11px' : '12px', color: '#9ca3af', textAlign:'center', fontWeight: '500'}}>No profile picture set</p>
               )}
            </div>

            <div style={styles.detailsSection}>
              {isEditing ? (
                <>
                  <div style={styles.formRow}>
                    <div style={{...styles.formField}} className="form-field-animate">
                      <label htmlFor="username" style={styles.label}>👤 Username *</label>
                      <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} style={styles.input} required />
                    </div>
                    <div style={{...styles.formField}} className="form-field-animate">
                      <label htmlFor="email" style={styles.label}>📧 Email *</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} style={styles.input} required />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                     <div style={{...styles.formField}} className="form-field-animate">
                        <label htmlFor="mobile" style={styles.label}>📱 Mobile</label>
                        <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} style={styles.input} />
                    </div>
                    <div style={{...styles.formField}} className="form-field-animate">
                      <label htmlFor="fatherName" style={styles.label}>👨‍👦 Father's Name</label>
                      <input type="text" id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleInputChange} style={styles.input} />
                    </div>
                  </div>
                   <div style={styles.formRow}>
                    <div style={{...styles.formField}} className="form-field-animate">
                      <label htmlFor="dateofBirth" style={styles.label}>🎂 Date of Birth</label>
                      <input type="date" id="dateofBirth" name="dateofBirth" value={formData.dateofBirth} onChange={handleInputChange} style={styles.input} />
                    </div>
                    <div style={{...styles.formField}} className="form-field-animate">
                      <label htmlFor="gender" style={styles.label}>⚧ Gender</label>
                      <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} style={styles.select}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={{...styles.formField}} className="form-field-animate">
                      <label htmlFor="bloodGroup" style={styles.label}>🩸 Blood Group</label>
                      <input type="text" id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} style={styles.input} />
                    </div>
                     <div style={{...styles.formField}} className="form-field-animate">
                        <label htmlFor="Nationality" style={styles.label}>🌍 Nationality</label>
                        <input type="text" id="Nationality" name="Nationality" value={formData.Nationality} onChange={handleInputChange} style={styles.input} />
                    </div>
                  </div>
                   <div style={styles.formRow}>
                    <div style={{...styles.formField}} className="form-field-animate">
                        <label htmlFor="Occupation" style={styles.label}>💼 Occupation</label>
                        <input type="text" id="Occupation" name="Occupation" value={formData.Occupation} onChange={handleInputChange} style={styles.input} />
                    </div>
                  </div>

                  <div style={styles.addressGroup}>
                    <p style={styles.addressTitle}>🏠 Address Information</p>
                    <div style={styles.formRow}>
                        <div style={{...styles.formField}} className="form-field-animate">
                            <label htmlFor="address.street" style={styles.label}>🛣️ Street</label>
                            <input type="text" id="address.street" name="address.street" value={formData.address?.street} onChange={handleInputChange} style={styles.input} />
                        </div>
                    </div>
                    <div style={styles.formRow}>
                        <div style={{...styles.formField}} className="form-field-animate">
                            <label htmlFor="address.city" style={styles.label}>🏙️ City</label>
                            <input type="text" id="address.city" name="address.city" value={formData.address?.city} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={{...styles.formField}} className="form-field-animate">
                            <label htmlFor="address.state" style={styles.label}>🗺️ State</label>
                            <input type="text" id="address.state" name="address.state" value={formData.address?.state} onChange={handleInputChange} style={styles.input} />
                        </div>
                    </div>
                     <div style={styles.formRow}>
                        <div style={{...styles.formField}} className="form-field-animate">
                            <label htmlFor="address.country" style={styles.label}>🌎 Country</label>
                            <input type="text" id="address.country" name="address.country" value={formData.address?.country} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={{...styles.formField}} className="form-field-animate">
                            <label htmlFor="address.zipCode" style={styles.label}>📮 Zip Code</label>
                            <input type="text" id="address.zipCode" name="address.zipCode" value={formData.address?.zipCode} onChange={handleInputChange} style={styles.input} />
                        </div>
                    </div>
                  </div>

                </>
              ) : (
                <>
                  <div style={styles.infoGroup}><span style={styles.infoLabel}>Username:</span> <span style={styles.infoText}>{userData.username || 'N/A'}</span></div>
                  <div style={styles.infoGroup}><span style={styles.infoLabel}>Email:</span> <span style={styles.infoText}>{userData.email || 'N/A'}</span></div>
                  <div style={styles.infoGroup}><span style={styles.infoLabel}>Mobile:</span> <span style={styles.infoText}>{userData.mobile || 'N/A'}</span></div>
                  <div style={styles.infoGroup}><span style={styles.infoLabel}>Father's Name:</span> <span style={styles.infoText}>{userData.fatherName || 'N/A'}</span></div>
                  <div style={styles.infoGroup}><span style={styles.infoLabel}>Date of Birth:</span> <span style={styles.infoText}>{userData.dateofBirth ? new Date(userData.dateofBirth).toLocaleDateString() : 'N/A'}</span></div>
                  <div style={styles.infoGroup}><span style={styles.infoLabel}>Gender:</span> <span style={styles.infoText}>{userData.gender || 'N/A'}</span></div>
                  <div style={styles.infoGroup}><span style={styles.infoLabel}>Blood Group:</span> <span style={styles.infoText}>{userData.bloodGroup || 'N/A'}</span></div>
                  <div style={styles.infoGroup}><span style={styles.infoLabel}>Nationality:</span> <span style={styles.infoText}>{userData.Nationality || 'N/A'}</span></div>
                  <div style={styles.infoGroup}><span style={styles.infoLabel}>Occupation:</span> <span style={styles.infoText}>{userData.Occupation || 'N/A'}</span></div>
                  {userData.address && (Object.keys(userData.address).length > 0 && (userData.address.street || userData.address.city)) && (
                    <div style={styles.addressGroup}>
                        <p style={styles.addressTitle}>Address</p>
                        {userData.address.street && <div style={styles.infoGroup}><span style={styles.infoLabel}>Street:</span> <span style={styles.infoText}>{userData.address.street}</span></div>}
                        {userData.address.city && <div style={styles.infoGroup}><span style={styles.infoLabel}>City:</span> <span style={styles.infoText}>{userData.address.city}</span></div>}
                        {userData.address.state && <div style={styles.infoGroup}><span style={styles.infoLabel}>State:</span> <span style={styles.infoText}>{userData.address.state}</span></div>}
                        {userData.address.country && <div style={styles.infoGroup}><span style={styles.infoLabel}>Country:</span> <span style={styles.infoText}>{userData.address.country}</span></div>}
                        {userData.address.zipCode && <div style={styles.infoGroup}><span style={styles.infoLabel}>Zip Code:</span> <span style={styles.infoText}>{userData.address.zipCode}</span></div>}
                    </div>
                  )}
                </>
              )}

              {isEditing && (
                <div style={styles.actions}>
                  <button
                    type="button"
                    onClick={() => {
                        setIsEditing(false);
                        // Reset form data to original user data or last saved state
                        setFormData({
                            username: userData.username || '',
                            email: userData.email || '',
                            mobile: userData.mobile || '',
                            fatherName: userData.fatherName || '',
                            dateofBirth: userData.dateofBirth ? new Date(userData.dateofBirth).toISOString().split('T')[0] : '',
                            gender: userData.gender || '',
                            bloodGroup: userData.bloodGroup || '',
                            Nationality: userData.Nationality || '',
                            Occupation: userData.Occupation || '',
                            address: {
                                street: userData.address?.street || '',
                                city: userData.address?.city || '',
                                state: userData.address?.state || '',
                                country: userData.address?.country || '',
                                zipCode: userData.address?.zipCode || '',
                            },
                        });
                        setProfilePicturePreview(userData.profilePicture?.url || DEFAULT_AVATAR); // Reset preview
                        setProfilePictureFile(null); // Clear selected file
                        setError(''); // Clear any previous errors
                    }}
                    style={styles.cancelButton}
                    disabled={isLoading}
                  >
                    🚫 Cancel
                  </button>
                  <button type="submit" style={styles.saveButton} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span style={styles.loadingSpinner}></span>
                        Saving Changes...
                      </>
                    ) : (
                      '💾 Save Changes'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;