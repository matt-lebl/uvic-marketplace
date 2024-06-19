import { createTheme } from '@mui/material/styles'

const MarketplaceTheme = createTheme({
  palette: {
    primary: {
      main: '#B5DBFF',
      contrastText: '#25496A',
    },
    secondary: {
      main: '#E3E3DC',
      contrastText: '#000000',
    },
  },
  typography: {
    fontFamily: 'Montserrat',
    h6: {
      fontSize: 30,
      fontWeight: 700,
    },
  },
})

export default MarketplaceTheme
