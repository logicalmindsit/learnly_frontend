// src/components/auth/ProfileForm.js

import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Typography, Grid, Avatar, InputLabel, Select, MenuItem, FormControl, Paper, Divider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// --- Style Objects for a Cleaner & More Professional Component ---
const styles = {
  formContainer: {
    padding: { xs: 1, sm: 1.5 },
  },
  profileSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    mb: 2,
  },
  avatar: {
    width: 120,
    height: 120,
    mb: 2,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  uploadButton: {
    textTransform: 'none',
    borderRadius: '8px',
  },
  sectionPaper: {
    p: { xs: 2, sm: 3.5 },
    borderRadius: '16px',
    border: '1px solid #E0E0E0',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontWeight: 600,
    color: '#0A033C',
    mb: 3,
  },
  submitButton: {
  marginleft:'10px',
  mt: 4,
  mb: 1,
  py: 0.5,         // smaller vertical padding
  px: 1.5,         // smaller horizontal padding
  fontSize: '0.85rem',
  fontWeight: '500',
  borderRadius: '6px', // smaller curve for rectangle look
  width: 'auto',       // or remove width entirely
  boxShadow: '0 2px 8px rgba(0, 123, 255, 0.2)',
  },
  genderFormControl: {
    minWidth: 120,
  },
  disabledInput: {
    '& .MuiInputBase-input.Mui-disabled': {
      textOverflow: 'ellipsis',
      WebkitTextFillColor: '#495057',
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
};

const ProfileForm = ({ userIdentifier, onProfileSaved, onError }) => {
  const isEmailSignup = userIdentifier && userIdentifier.email;

  const [formData, setFormData] = useState({
    username: '', email: '', mobile: '', fatherName: '', dateofBirth: '', gender: '',
    bloodGroup: '', Nationality: '', Occupation: '', street: '', city: '',
    state: '', country: '', zipCode: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const dataPayload = new FormData();
    for (const key in formData) { if (formData[key]) dataPayload.append(key, formData[key]); }
    if(isEmailSignup) dataPayload.append('email', userIdentifier.email); else dataPayload.append('mobile', userIdentifier.mobile);
    if (formData.street || formData.city) dataPayload.append('address', JSON.stringify({ street: formData.street, city: formData.city, state: formData.state, country: formData.country, zipCode: formData.zipCode }));
    if (profilePicture) dataPayload.append('profilePicture', profilePicture); else { onError("Profile picture is required."); setLoading(false); return; }
    try { onProfileSaved(dataPayload); } catch (err) { onError(err.message || 'Profile update failed.'); } finally { setLoading(false); }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={styles.formContainer}>
      <Grid container spacing={4}>
        
        <Grid item xs={12} sx={styles.profileSection}>
          <Avatar src={profilePreview} sx={styles.avatar}>
            {!profilePreview && <AccountCircleIcon sx={{ fontSize: '5rem', color: 'grey.400' }} />}
          </Avatar>
          <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} sx={styles.uploadButton}>
            Upload Profile Picture
            <input type="file" hidden accept="image/*" onChange={handleFileChange} name="profilePicture" />
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={styles.sectionPaper}>
            <Typography variant="h6" sx={styles.sectionTitle}> User Details </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}> <TextField name="username" label="Username" fullWidth required value={formData.username} onChange={handleChange} /> </Grid>
              <Grid item xs={12} sm={6}> <TextField name="fatherName" label="Father's Name" fullWidth value={formData.fatherName} onChange={handleChange} /> </Grid>
              <Grid item xs={12} sm={6}> <TextField name="dateofBirth" label="Date of Birth" type="date" fullWidth value={formData.dateofBirth} onChange={handleChange} InputLabelProps={{ shrink: true }} /> </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" sx={styles.genderFormControl}>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select labelId="gender-label" name="gender" value={formData.gender} label="Gender" onChange={handleChange}> <MenuItem value="Male">Male</MenuItem> <MenuItem value="Female">Female</MenuItem> <MenuItem value="Other">Other</MenuItem> </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}> <TextField name="bloodGroup" label="Blood Group" fullWidth value={formData.bloodGroup} onChange={handleChange} /> </Grid>
              <Grid item xs={12} sm={6}> <TextField name="Nationality" label="Nationality" fullWidth value={formData.Nationality} onChange={handleChange} /> </Grid>
              <Grid item xs={12}> <TextField name="Occupation" label="Occupation" fullWidth value={formData.Occupation} onChange={handleChange} /> </Grid>
              
              <Grid item xs={12}> <Divider sx={{ my: 1.5 }} /> </Grid>

              {/* --- ICONS REMOVED FROM THESE TWO TEXTFIELDS --- */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email" // Added for correctness
                  label="Email Address"
                  fullWidth
                  value={isEmailSignup ? userIdentifier.email : formData.email}
                  onChange={handleChange}
                  required={!isEmailSignup}
                  disabled={isEmailSignup}
                  variant="filled"
                  sx={styles.disabledInput}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="mobile"
                  label="Mobile Number"
                  fullWidth
                  value={!isEmailSignup ? userIdentifier.mobile : formData.mobile}
                  onChange={handleChange}
                  required={isEmailSignup}
                  disabled={!isEmailSignup}
                  variant="filled"
                  sx={styles.disabledInput}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={styles.sectionPaper}>
            <Typography variant="h6" sx={styles.sectionTitle}> Address </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}> <TextField name="street" label="Street" fullWidth value={formData.street} onChange={handleChange} /> </Grid>
              <Grid item xs={12} sm={6}> <TextField name="city" label="City" fullWidth value={formData.city} onChange={handleChange} /> </Grid>
              <Grid item xs={12} sm={6}> <TextField name="state" label="State" fullWidth value={formData.state} onChange={handleChange} /> </Grid>
              <Grid item xs={12} sm={6}> <TextField name="country" label="Country" fullWidth value={formData.country} onChange={handleChange} /> </Grid>
              <Grid item xs={12} sm={6}> <TextField name="zipCode" label="Pincode" fullWidth value={formData.zipCode} onChange={handleChange} /> </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      <Button type="submit" fullWidth variant="contained" sx={styles.submitButton} disabled={loading}>
        {loading ? <CircularProgress size={26} color="inherit" /> : 'Save Profile & Complete Signup'}
      </Button>
    </Box>
  );
};

export default ProfileForm;