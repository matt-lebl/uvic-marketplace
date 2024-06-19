import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import Router from './pages/Router'
import MarketplaceTheme from './Theme'

function App() {
  return (
    <ThemeProvider theme={MarketplaceTheme}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
