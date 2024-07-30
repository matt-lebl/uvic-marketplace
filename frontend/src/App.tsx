import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import Router from './pages/Router'
import MarketplaceTheme from './Theme'
import { CssBaseline } from '@mui/material'
import { DataProvider } from './DataContext'

function App() {
  return (
    <ThemeProvider theme={MarketplaceTheme}>
      <CssBaseline />
      <DataProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  )
}

export default App
