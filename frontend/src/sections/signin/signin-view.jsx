import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from 'src/slices/userApiSlice';
import { setCredentials } from 'src/slices/authSlice';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { bgGradient } from 'src/theme/css';
import Iconify from 'src/components/iconify';
import { toast } from 'react-toastify';
import { RouterLink } from 'src/routes/components';
import { InputLabel, MenuItem } from '@mui/material';
import Select from '@mui/material/Select';

// ----------------------------------------------------------------------

export default function SigninView() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    checkPassword: '',
  });
  const [yearClass, setYearClass] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerApi, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get('redirect') || '/';

  const handleChangee = (event) => {
    setYearClass(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const validateEmail = (email) => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@sktcollege.edu.mm$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => password.length >= 6;

  const validateName = (name) => name.length >= 1 && name.length <= 16;

  const handleClick = async () => {
    if (!validateEmail(formData.email)) {
      setEmailError('Invalid email format');
      toast.warning('Please use school email');
      return;
    }

    if (!validatePassword(formData.password)) {
      setPasswordError('Password must be at least 6 characters long');
      toast.warning('Password must be at least 6 characters long');
      return;
    }

    if (!validateName(formData.name)) {
      setNameError('Name must be 1 to 16 characters');
      toast.warning('Name must be  between 1 to 16 characters long');
      return;
    }
    if (formData.password !== formData.checkPassword) {
      toast.error(`Passwords do not match 😾`);
      return;
    }
    if (yearClass === '') {
      toast.error(`Please select a class 😾`);
      return;
    }
    try {
      const { name, password, email } = formData;
      const res = await registerApi({ name, password, email, yearClass }).unwrap();
      dispatch(dispatch(setCredentials({ ...res })));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const classYears = Array.from({ length: 13 }, (_, index) => (index + 1).toString());

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField name="name" label="username" value={formData.name} onChange={handleChange} />
        <TextField
          onChange={handleChange}
          value={formData.password}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          onChange={handleChange}
          value={formData.checkPassword}
          name="checkPassword"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <InputLabel id="demo-controlled-open-select-label">Class</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={yearClass}
          label="Age"
          onChange={handleChangee}
        >
          {classYears.map((year) => (
            <MenuItem key={year} value={`Year ${year}`}>
              {year === '13' ? `Year 13 🌟` : `Year ${year}`}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
      >
        Sign Up
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign up to SKT Council</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Already have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }} component={RouterLink} href="/login">
              Log in
            </Link>
          </Typography>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body3" sx={{ color: 'text.secondary' }}>
              <></>
            </Typography>
          </Divider>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
