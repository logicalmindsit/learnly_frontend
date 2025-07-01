import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiArrowLeft } from 'react-icons/fi'; // Icon is already imported

// API Base URL
const API_BASE_URL = 'https://learnly-backend-05ix.onrender.com';

// Default placeholder image
const DEFAULT_AVATAR = 'https://via.placeholder.com/150/CCCCCC/FFFFFF?Text=No+Image';


const ProfilePage = () => {
  // All of your original state and refs are here, unchanged
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

  // All of your original functions are here, unchanged
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getToken = () => localStorage.getItem('token');

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
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

    const payload = { ...formData };
    if (payload.address) {
        payload.address = Object.fromEntries(
            Object.entries(payload.address).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        );
        if (Object.keys(payload.address).length === 0) {
            delete payload.address;
        }
    }
    if (payload.dateofBirth === '') {
        payload.dateofBirth = null;
    }


    try {
      const response = await axios.put(`${API_BASE_URL}/putprofile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data.user);
       setFormData({
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
      setSuccessMessage("Profile picture updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile picture.");
      console.error("Update picture error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Your original styles object, unchanged
  const styles = {
    pageContainer: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f0f2f5', minHeight: '100vh', padding: isMobileView ? '20px' : '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' },
    profileCard: { backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '900px', overflow: 'hidden' },
    cardHeader: { backgroundColor: '#007bff', color: 'white', padding: '20px 30px', fontSize: '24px', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    editButton: { backgroundColor: '#ffffff', color: '#007bff', border: '1px solid #007bff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.3s ease' },
    cardBody: { padding: '30px', display: 'flex', flexDirection: isMobileView ? 'column' : 'row', gap: '30px' },
    pictureSection: { flex: isMobileView ? '1' : '0 0 250px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
    profileImage: { width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #007bff', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' },
    fileInput: { display: 'none' },
    uploadButton: { backgroundColor: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', width: '100%', maxWidth: '180px', textAlign: 'center' },
    detailsSection: { flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' },
    formRow: { display: 'flex', flexDirection: isMobileView ? 'column' : 'row', gap: '20px' },
    formField: { flex: '1', display: 'flex', flexDirection: 'column', gap: '5px', minWidth: isMobileView ? 'none' : '200px' },
    label: { fontWeight: '600', fontSize: '14px', color: '#333' },
    input: { padding: '12px 15px', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '15px', width: '100%', boxSizing: 'border-box' },
    select: { padding: '12px 15px', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '15px', backgroundColor: 'white', width: '100%', boxSizing: 'border-box' },
    textarea: { padding: '12px 15px', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '15px', width: '100%', minHeight: '80px', boxSizing: 'border-box', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    infoText: { fontSize: '15px', color: '#555', padding: '10px 0', borderBottom: '1px solid #eee', wordBreak: 'break-word' },
    infoGroup: { marginBottom: '15px' },
    infoLabel: { fontWeight: '600', fontSize: '14px', color: '#333', display: 'block', marginBottom: '5px' },
    actions: { marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'flex-end' },
    saveButton: { backgroundColor: '#007bff', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' },
    cancelButton: { backgroundColor: '#6c757d', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' },
    loadingMessage: { textAlign: 'center', fontSize: '18px', color: '#007bff', padding: '50px' },
    message: { padding: '15px', margin: '20px 0', borderRadius: '6px', textAlign: 'center', fontWeight: '500' },
    errorMessage: { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
    successMessage: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
    studentId: { backgroundColor: '#e9ecef', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', color: '#495057', fontWeight: 'bold', textAlign: 'center', margin: '10px 0 20px 0', border: '1px dashed #adb5bd' },
    addressGroup: { padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', marginTop: '10px', backgroundColor: '#f9f9f9' },
    addressTitle: { fontSize: '16px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px', borderBottom: '1px solid #007bff', paddingBottom: '5px' }
  };

  // 2. ADDED: Style for the back button to use in the header
  const backButtonStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      border: 'none',
      color: 'white',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease-in-out',
  };

  if (isLoading && !userData) { return <div style={styles.loadingMessage}>Loading Profile...</div>; }
  if (error && !userData) { return <div style={{ ...styles.message, ...styles.errorMessage }}>{error}</div>; }
  if (!userData) { return <div style={styles.loadingMessage}>No user data available.</div>; }

  return (
    <div style={styles.pageContainer}>
      {error && <div style={{ ...styles.message, ...styles.errorMessage }}>{error}</div>}
      {successMessage && <div style={{ ...styles.message, ...styles.successMessage }}>{successMessage}</div>}

      <div style={styles.profileCard}>
        <div style={styles.cardHeader}>
          {/* 3. MODIFIED: This is the only part of your layout that has changed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button
              style={backButtonStyle}
              onClick={() => window.history.back()}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              aria-label="Go back"
            >
              <FiArrowLeft size={22} />
            </button>
            <span>My Profile</span>
          </div>

          {!isEditing && (
            <button style={styles.editButton} onClick={() => setIsEditing(true)}>
              Edit Profile
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
            <div style={styles.pictureSection}>
              <img
                src={profilePicturePreview || userData.profilePicture?.url || DEFAULT_AVATAR}
                alt="Profile"
                style={styles.profileImage}
              />
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
                    Change Photo
                  </button>
                  {profilePictureFile && (
                    <button
                      type="button"
                      onClick={handleUpdateProfilePicture}
                      style={{...styles.uploadButton, backgroundColor: '#007bff', marginTop: '10px'}}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Uploading...' : 'Upload New Photo'}
                    </button>
                  )}
                </>
              )}
               {!isEditing && userData.profilePicture?.url && (
                 <p style={{fontSize: '12px', color: '#777', textAlign:'center'}}>Current Profile Picture</p>
               )}
               {!isEditing && !userData.profilePicture?.url && (
                 <p style={{fontSize: '12px', color: '#777', textAlign:'center'}}>No profile picture set.</p>
               )}
            </div>

            <div style={styles.detailsSection}>
              {isEditing ? (
                <>
                  <div style={styles.formRow}>
                    <div style={styles.formField}>
                      <label htmlFor="username" style={styles.label}>Username *</label>
                      <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} style={styles.input} required />
                    </div>
                    <div style={styles.formField}>
                      <label htmlFor="email" style={styles.label}>Email *</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} style={styles.input} required />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                     <div style={styles.formField}>
                        <label htmlFor="mobile" style={styles.label}>Mobile</label>
                        <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} style={styles.input} />
                    </div>
                    <div style={styles.formField}>
                      <label htmlFor="fatherName" style={styles.label}>Father's Name</label>
                      <input type="text" id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleInputChange} style={styles.input} />
                    </div>
                  </div>
                   <div style={styles.formRow}>
                    <div style={styles.formField}>
                      <label htmlFor="dateofBirth" style={styles.label}>Date of Birth</label>
                      <input type="date" id="dateofBirth" name="dateofBirth" value={formData.dateofBirth} onChange={handleInputChange} style={styles.input} />
                    </div>
                    <div style={styles.formField}>
                      <label htmlFor="gender" style={styles.label}>Gender</label>
                      <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} style={styles.select}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.formField}>
                      <label htmlFor="bloodGroup" style={styles.label}>Blood Group</label>
                      <input type="text" id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} style={styles.input} />
                    </div>
                     <div style={styles.formField}>
                        <label htmlFor="Nationality" style={styles.label}>Nationality</label>
                        <input type="text" id="Nationality" name="Nationality" value={formData.Nationality} onChange={handleInputChange} style={styles.input} />
                    </div>
                  </div>
                   <div style={styles.formRow}>
                    <div style={styles.formField}>
                        <label htmlFor="Occupation" style={styles.label}>Occupation</label>
                        <input type="text" id="Occupation" name="Occupation" value={formData.Occupation} onChange={handleInputChange} style={styles.input} />
                    </div>
                  </div>

                  <div style={styles.addressGroup}>
                    <p style={styles.addressTitle}>Address</p>
                    <div style={styles.formRow}>
                        <div style={styles.formField}>
                            <label htmlFor="address.street" style={styles.label}>Street</label>
                            <input type="text" id="address.street" name="address.street" value={formData.address?.street} onChange={handleInputChange} style={styles.input} />
                        </div>
                    </div>
                    <div style={styles.formRow}>
                        <div style={styles.formField}>
                            <label htmlFor="address.city" style={styles.label}>City</label>
                            <input type="text" id="address.city" name="address.city" value={formData.address?.city} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formField}>
                            <label htmlFor="address.state" style={styles.label}>State</label>
                            <input type="text" id="address.state" name="address.state" value={formData.address?.state} onChange={handleInputChange} style={styles.input} />
                        </div>
                    </div>
                     <div style={styles.formRow}>
                        <div style={styles.formField}>
                            <label htmlFor="address.country" style={styles.label}>Country</label>
                            <input type="text" id="address.country" name="address.country" value={formData.address?.country} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formField}>
                            <label htmlFor="address.zipCode" style={styles.label}>Zip Code</label>
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
                        setProfilePicturePreview(userData.profilePicture?.url || DEFAULT_AVATAR);
                        setProfilePictureFile(null);
                        setError('');
                    }}
                    style={styles.cancelButton}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button type="submit" style={styles.saveButton} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
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