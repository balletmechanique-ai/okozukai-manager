import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import App from './App'

const theme = createTheme({
  palette: { primary: { main: '#2e7d32' }, background: { default: '#f6f7f3' } },
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
