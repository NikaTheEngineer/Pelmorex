import {
  AppBar, Box, Container, Toolbar, Typography
} from '@mui/material';
import { Link } from 'react-router-dom';

import Logo from '../../assets/logo.png';

const Header = () => (
  <>
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'white',
        color: 'black',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
      }}
    >
      <Container
        sx={{
          maxWidth: '1920px !important',
        }}
      >
        <Toolbar disableGutters sx={{ display: { xs: 'flex' }, justifyContent: { xs: 'space-between' } }}>
          <Box
            component={Link}
            to="/list"
            sx={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none',
            }}
          >
            <Box
              component="img"
              src={Logo}
              sx={{
                width: '48px',
              }}
            />
            <Typography color="black" maxWidth="480px" sx={{ display: { xs: 'none', md: 'block' }, ml: '16px' }}>
              Zoo Animals
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ textDecoration: 'none', color: 'black', mr: '4px' }} component={Link} to="/list">
              List
            </Box>
            |
            <Box sx={{
              textDecoration: 'none', color: 'black', ml: '4px', mr: '12px'
            }} component={Link} to="/about">
              About
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  </>
);

export default Header;
