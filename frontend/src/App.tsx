import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import Router from './pages/Router'
import MarketplaceTheme from './Theme'
import { CssBaseline } from '@mui/material'
import { AuthProvider } from './pages/Components/AuthContext'

function App() {
  return (
    <ThemeProvider theme={MarketplaceTheme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
