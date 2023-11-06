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
import { List } from '@mui/material';

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

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name,
        email: user.email,
        password: '', // Leave the password and confirmNewPassword empty initially
        confirmNewPassword: '',
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateEmail();
    validatePassword();

    if (
      userData.email === user?.email &&
      userData.password === '' &&
      userData.name === user?.name
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
      const returnedData = await updateProfile(userData);
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
            label="Password"
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
          <Grid container justifyContent="flex-end">
            <Button type="submit" variant="contained" color="primary" style={buttonStyle}>
              Save Changes
            </Button>
          </Grid>
        </form>
      </CardContent>
      <CardContent>
          Notice
          <List>- using fake email - banned </List>
          <List>- using fake name - banned</List>
          <List>-Intentionally abusing the server - banned</List>
      </CardContent>
    </Card>
  );
}
