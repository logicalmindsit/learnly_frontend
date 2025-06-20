// import React, { useState } from 'react';
// import { Box, TextField, Button, CircularProgress, Typography, Grid, Avatar, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// const ProfileForm = ({ userIdentifier, onProfileSaved, onError }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     fatherName: '',
//     dateofBirth: '', // Format: YYYY-MM-DD
//     gender: '',
//     bloodGroup: '',
//     Nationality: '',
//     Occupation: '',
//     street: '',
//     city: '',
//     state: '',
//     country: '',
//     zipCode: '',
//   });
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [profilePreview, setProfilePreview] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfilePicture(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const dataPayload = new FormData();
//     for (const key in formData) {
//       if (formData[key]) { // Only append if value exists
//         dataPayload.append(key, formData[key]);
//       }
//     }
//     if (profilePicture) {
//       dataPayload.append( 'profilePicture'); // Backend expects 'profile'
//     } else {
//       onError("Profile picture is required."); // As per backend validation
//       setLoading(false);
//       return;
//     }

//     try {
//       // Pass userIdentifier so authService can potentially add email/mobile to formData
//       // if your backend saveFormData needs it to identify the user.
//       onProfileSaved(dataPayload, userIdentifier);
//     } catch (err) {
//       onError(err.message || 'Profile update failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
//       <Typography variant="h6" gutterBottom>
//         Complete Your Profile
//       </Typography>
//       <Grid container spacing={2}>
//         <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
//           <Avatar src={profilePreview} sx={{ width: 100, height: 100, mb: 1 }}>
//             {!profilePreview && <AccountCircleIcon sx={{ fontSize: 60 }} />}
//           </Avatar>
//           <Button
//             variant="outlined"
//             component="label"
//             startIcon={<CloudUploadIcon />}
//           >
//             Upload Profile Picture
//             <input type="file" hidden accept="image/*" onChange={handleFileChange} name="profile" />
//           </Button>
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <TextField name="username" label="Username" fullWidth value={formData.username} onChange={handleChange} required />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField name="fatherName" label="Father's Name" fullWidth value={formData.fatherName} onChange={handleChange} />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             name="dateofBirth"
//             label="Date of Birth"
//             type="date"
//             fullWidth
//             value={formData.dateofBirth}
//             onChange={handleChange}
//             InputLabelProps={{ shrink: true }}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <InputLabel id="gender-label">Gender</InputLabel>
//             <Select
//               labelId="gender-label"
//               name="gender"
//               value={formData.gender}
//               label="Gender"
//               onChange={handleChange}
//             >
//               <MenuItem value="Male">Male</MenuItem>
//               <MenuItem value="Female">Female</MenuItem>
//               <MenuItem value="Other">Other</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField name="bloodGroup" label="Blood Group" fullWidth value={formData.bloodGroup} onChange={handleChange} />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField name="Nationality" label="Nationality" fullWidth value={formData.Nationality} onChange={handleChange} />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField name="Occupation" label="Occupation" fullWidth value={formData.Occupation} onChange={handleChange} />
//         </Grid>
//          <Grid item xs={12}>
//           <Typography variant="subtitle1" sx={{mt:1}}>Address</Typography>
//         </Grid>
//         <Grid item xs={12}>
//           <TextField name="street" label="Street" fullWidth value={formData.street} onChange={handleChange} />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField name="city" label="City" fullWidth value={formData.city} onChange={handleChange} />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField name="state" label="State" fullWidth value={formData.state} onChange={handleChange} />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField name="country" label="Country" fullWidth value={formData.country} onChange={handleChange} />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField name="zipCode" label="Zip Code" fullWidth value={formData.zipCode} onChange={handleChange} />
//         </Grid>
//       </Grid>
//       <Button
//         type="submit"
//         fullWidth
//         variant="contained"
//         sx={{ mt: 3, mb: 2 }}
//         disabled={loading}
//       >
//         {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Profile & Complete Signup'}
//       </Button>
//     </Box>
//   );
// };

// export default ProfileForm;



import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Typography, Grid, Avatar, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ProfileForm = ({ userIdentifier, onProfileSaved, onError }) => {
  const [formData, setFormData] = useState({
    username: '',
    fatherName: '',
    dateofBirth: '', // Format: YYYY-MM-DD
    gender: '',
    bloodGroup: '',
    Nationality: '',
    Occupation: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataPayload = new FormData();
    for (const key in formData) {
      if (formData[key]) { // Only append if value exists
        dataPayload.append(key, formData[key]);
      }
    }
    
    // Append address fields
    if (formData.street) dataPayload.append('address[street]', formData.street);
    if (formData.city) dataPayload.append('address[city]', formData.city);
    if (formData.state) dataPayload.append('address[state]', formData.state);
    if (formData.country) dataPayload.append('address[country]', formData.country);
    if (formData.zipCode) dataPayload.append('address[zipCode]', formData.zipCode);

    if (profilePicture) {
      dataPayload.append('profilePicture', profilePicture); // Changed to match backend expectation
    } else {
      onError("Profile picture is required.");
      setLoading(false);
      return;
    }

    try {
      onProfileSaved(dataPayload, userIdentifier); 
    } catch (err) {
      onError(err.message || 'Profile update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        Complete Your Profile
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar src={profilePreview} sx={{ width: 100, height: 100, mb: 1 }}>
            {!profilePreview && <AccountCircleIcon sx={{ fontSize: 60 }} />}
          </Avatar>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Upload Profile Picture
            <input 
              type="file" 
              hidden 
              accept="image/*" 
              onChange={handleFileChange} 
              name="profilePicture" // Changed to match backend expectation
            />
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField name="username" label="Username" fullWidth value={formData.username} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="fatherName" label="Father's Name" fullWidth value={formData.fatherName} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="dateofBirth"
            label="Date of Birth"
            type="date"
            fullWidth
            value={formData.dateofBirth}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              name="gender"
              value={formData.gender}
              label="Gender"
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="bloodGroup" label="Blood Group" fullWidth value={formData.bloodGroup} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="Nationality" label="Nationality" fullWidth value={formData.Nationality} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="Occupation" label="Occupation" fullWidth value={formData.Occupation} onChange={handleChange} />
        </Grid>
         <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{mt:1}}>Address</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField name="street" label="Street" fullWidth value={formData.street} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="city" label="City" fullWidth value={formData.city} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="state" label="State" fullWidth value={formData.state} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="country" label="Country" fullWidth value={formData.country} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="zipCode" label="Zip Code" fullWidth value={formData.zipCode} onChange={handleChange} />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Profile & Complete Signup'}
      </Button>
    </Box>
  );
};

export default ProfileForm;