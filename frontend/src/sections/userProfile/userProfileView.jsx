import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useEditUserProfileMutation, useGetUserProfileQuery } from 'src/slices/userApiSlice';
import Loader from 'src/components/loader/Loader';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setCredentials } from 'src/slices/authSlice';
import { InputLabel, List, Paper } from '@mui/material';
import { Box } from '@mui/system';
import { useDeleteImageMutation, useUploadBlogImageMutation } from 'src/slices/blogsApiSlice';
import { Icon } from '@iconify/react';

const cardStyle = {
  maxWidth: 600,
  margin: '0 auto',
  marginTop: '20px',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
};

const buttonStyle = {
  marginTop: '20px',
};

export default function UserProfileView() {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    password: '',
    confirmNewPassword: '',
  });
  const { data: user, isLoading, error } = useGetUserProfileQuery();
  const [updateProfile, { isError }] = useEditUserProfileMutation();
  const dispatch = useDispatch();

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [uploadedImage, setImage] = useState('/assets/images/covers/cover_1.jpg');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadImage] = useUploadBlogImageMutation();
  const [imageSrc, setImageSrc] = useState('');
  const [deleteImage] = useDeleteImageMutation();

  useEffect(() => {
    if (user) {
      console.log(user);
      setUserData({
        name: user.name,
        email: user.email,
        password: '', // Leave the password and confirmNewPassword empty initially
        confirmNewPassword: '',
      });
      setImage(user.avatar);
    }
  }, [user]);

  const validateEmail = () => {
    // Check if email ends with the expected domain
    if (userData.email.endsWith('.edu.mm')) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const validatePassword = () => {
    // Check if the password has a minimum length of, for example, 8 characters
    if (userData.password.length >= 5) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const imageURL = URL.createObjectURL(selectedFile);
      setImageSrc(imageURL);
    }
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      if (!uploadedImage.startsWith('/assets/images/avatars/')) {
        // Extract public ID from the image URL
        const publicId = uploadedImage.split('/').pop().split('.')[0];
        await deleteImage(publicId);
      }

      const data = new FormData();
      data.append('image', file);
      const response = await uploadImage(data);
      setImage(response.data.secure_url);
      toast.success('Image uploaded successfully');
    } catch (es) {
      alert(es.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateEmail();
    validatePassword();

    if (
      userData.email === user?.email &&
      userData.password === '' &&
      userData.name === user?.name &&
      userData.avatar === user?.avatar
    ) {
      toast.info("Please don't overload the server, you will be banned : (");
      return;
    }

    if (userData.name.length > 18) {
      toast.warning('Name cannot be more than 18 characters');
      return;
    }
    if (emailError) {
      toast.warning('Email should be school email');
      return;
    }
    if (passwordError) {
      toast.warning('Password should be at least 5 characters');
      return;
    }
    if (userData.password !== userData.confirmNewPassword) {
      toast.error('Passwords do not match ');
      return;
    }

    try {
      const returnedData = await updateProfile({ ...userData, avatar: uploadedImage });
      dispatch(setCredentials(returnedData.data));
      toast.success('Profile updated successfully');
    } catch (er) {
      toast.error(error.er);
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return toast.error(
      error?.data?.message || error?.error || 'Something went wrong 😔, you can log out and restart'
    );

  return (
    <Card style={cardStyle}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          User Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            value={userData.name}
            onChange={handleInputChange}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            value={userData.email}
            onChange={handleInputChange}
            margin="normal"
            fullWidth
          />
          <TextField
            label="New Password"
            name="password"
            type="password"
            variant="outlined"
            value={userData.password}
            onChange={handleInputChange}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Confirm Password"
            name="confirmNewPassword"
            type="password"
            variant="outlined"
            value={userData.confirmNewPassword}
            onChange={handleInputChange}
            margin="normal"
            fullWidth
          />
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <Typography variant="p">Upload your profile Image</Typography>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <input
              name="file"
              id="file"
              type="file"
              onChange={handleSelectFile}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <InputLabel htmlFor="file">
              <Button
                variant="contained"
                component="span"
                startIcon={<Icon icon="material-symbols:upload" />}
              >
                Select File
              </Button>
            </InputLabel>
            {file && (
              <Typography style={{ marginTop: '20px' }} variant="body1">
                Your file name - {file.name}
              </Typography>
            )}
            {file && (
              <Box mt={2}>
                <Paper elevation={3}>
                  <img
                    src={imageSrc}
                    alt="Showing preview"
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                  />
                </Paper>
              </Box>
            )}
            {file && (
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  style={{ marginTop: '20px' }}
                >
                  {loading ? 'Uploading...' : 'Upload the image'}
                </Button>
              </div>
            )}
          </Grid>
          <Grid container justifyContent="flex-end">
            <Button type="submit" variant="contained" color="primary" style={buttonStyle}>
              Save Changes
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}
