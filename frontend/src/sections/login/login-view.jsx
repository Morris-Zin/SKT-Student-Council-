import { useEffect, useState, useCallback } from 'react';
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
import { RouterLink } from 'src/routes/components';
import { FormControl } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from 'src/slices/userApiSlice';
import { setCredentials } from 'src/slices/authSlice';
import { toast } from 'react-toastify';
// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get('redirect') || '/';

  const handleClick = useCallback(async () => {
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  }, [email, password, login, dispatch, redirect, navigate]);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }

    const handleKeyPress = (event) => {
      if (
        (event.key === 'Enter' || event.key === 'Return') &&
        !isLoading &&
        email !== '' &&
        password !== ''
      ) {
        handleClick();
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      // Cleanup the event listener when the component unmounts
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [userInfo, redirect, navigate, isLoading, email, password, handleClick]);

  const renderForm = (
    <FormControl style={{ width: '100%' }}>
      <Stack spacing={3}>
        <TextField onChange={(e) => setEmail(e.target.value)} name="email" label="Email address" />

        <TextField
          onChange={(e) => {
            setPassword(e.target.value);
          }}
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
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover" component={RouterLink} to="/">
          Go back to home?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        disabled={isLoading || email === '' || password === ''}
      >
        Login
      </LoadingButton>
      {isLoading && <h3>processing sir/madam pls wait</h3>}
    </FormControl>
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
          <Typography variant="h4">Sign in to the SKT Council</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link
              variant="subtitle2"
              sx={{ ml: 0.5 }}
              href={redirect ? `/signup?redirect=${redirect}` : '/register'}
              component={RouterLink}
            >
              Get started
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
