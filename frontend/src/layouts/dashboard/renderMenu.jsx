import React from 'react';
import SvgColor from 'src/components/svg-color';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from 'src/slices/userApiSlice';
import { logout } from 'src/slices/authSlice';
// ----------------------------------------------------------------------
const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const RenderMenu = () => {
  const {userInfo} = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi, { isError }] = useLogoutMutation();

  const handleClick = async (param) => {
    if (param === 'logout') {
      try {
        await logoutApi().unwrap();
        dispatch(logout());
        navigate('/login');
      } catch (error) {
        console.error(error);
      }
    }
  };
  console.log(userInfo, "Admin")

  const navConfig = [
    {
      title: 'posts',
      path: '/',
      icon: icon('ic_blog'),
    },
    // Conditionally show "users" link only if the user is an admin
    ...(userInfo && userInfo.isAdmin
      ? [
          {
            title: 'users',
            path: '/users',
            icon: icon('ic_user'),
          },
        ]
      : []),
    // Conditionally show "login" and "signup" based on user authentication
    ...(userInfo
      ? [
          {
            title: 'profile',
            path: '/profile',
            icon: icon('ic_user'),
          },
          {
            title: 'logout',
            path: '/logout',
            icon: icon('ic_user'),
          },
        ]
      : [
          {
            title: 'login',
            path: '/login',
            icon: icon('ic_lock'),
          },
          {
            title: 'signup',
            path: '/signup',
            icon: icon('ic_lock'),
          },
        ]),
  ];

  return (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem onClick={() => handleClick(item.title)} key={item.title} item={item} />
      ))}
    </Stack>
  );
};

function NavItem({ item, onClick }) {
  const pathname = usePathname();

  const active = item.path === pathname;

  return (
    <ListItemButton
      onClick={onClick}
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
  onClick: PropTypes.func,
};

export default RenderMenu;
