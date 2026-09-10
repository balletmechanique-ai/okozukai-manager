import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import App from './App'

const theme = createTheme({
  palette: {
    primary: { main: '#c04e61', dark: '#792e42', light: '#e25c73' },
    secondary: { main: '#5aa89c' },
    background: { default: '#fdf4f1', paper: '#fffaf8' },
    success: { main: '#4e9d8f', light: '#cdeae3', dark: '#2f6b62', contrastText: '#14332e' },
    warning: { main: '#e3ad8d', light: '#f8e0cf', dark: '#c47a52', contrastText: '#4a2c1a' },
    error: { main: '#c4455a', light: '#f5c4cc', dark: '#792e42', contrastText: '#4a1522' },
    text: { primary: '#3d2430', secondary: '#7a5a64' },
  },
  shape: { borderRadius: 16 },
  typography: { fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
