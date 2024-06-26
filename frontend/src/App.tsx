import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import Router from './pages/Router'
import MarketplaceTheme from './Theme'
import { CssBaseline } from '@mui/material'
import {APIContextProvider} from './APIlink';

function App() {
  return (
    <ThemeProvider theme={MarketplaceTheme}>
      <CssBaseline />
      <APIContextProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </APIContextProvider>
    </ThemeProvider>
  )
}

export default App
