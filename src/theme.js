import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Lato',
      '"Space Mono"',
      'Poppins',
      'sans-serif'
    ].join(','),
  }
});

export default theme;
