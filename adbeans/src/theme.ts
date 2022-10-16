import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#047BA7',
    },
    secondary: {
      main: '#36474f',
    },
  },
  typography: {
    fontFamily: [].join(','),
    button: {
      textTransform: 'none',
      fontFamily: 'inherit',
    },
  },
});

export default theme;
