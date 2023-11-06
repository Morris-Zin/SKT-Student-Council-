import { lazy, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

const Nav = lazy(() => import('./nav'));
const Main = lazy(() => import("./main"))
const Header = lazy(() => import('./header'));

// ----------------------------------------------------------------------

export default function NavLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main>{children}</Main>
      </Box>
    </>
  );
}

NavLayout.propTypes = {
  children: PropTypes.node,
};
