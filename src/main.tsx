import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import App from './App'

const theme = createTheme({
  palette: {
    primary: { main: '#f04f78', dark: '#c9365c', light: '#ff87a2', contrastText: '#ffffff' },
    secondary: { main: '#50c9b5', dark: '#279b89', light: '#a7eadf', contrastText: '#173d37' },
    background: { default: '#fff7e9', paper: '#fffdf8' },
    success: { main: '#36bda7', light: '#bff1e8', dark: '#178573', contrastText: '#16443d' },
    warning: { main: '#f4a83b', light: '#ffe3a8', dark: '#c87711', contrastText: '#593600' },
    error: { main: '#ed5273', light: '#ffc6d3', dark: '#b92d50', contrastText: '#61142a' },
    text: { primary: '#51263a', secondary: '#8a5c6e' },
  },
  shape: { borderRadius: 20 },
  typography: {
    fontFamily: '"Hiragino Maru Gothic ProN", "Yu Gothic", system-ui, sans-serif',
    button: { fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'linear-gradient(180deg, #fff7e9 0%, #fffaf4 100%)',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(110deg, #f04f78 0%, #ff7690 58%, #ff9b78 100%)',
          boxShadow: '0 5px 20px rgba(218, 56, 96, 0.22)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(240, 79, 120, 0.10)',
          boxShadow: '0 8px 24px rgba(128, 62, 84, 0.10)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: 'none',
          '&.MuiButton-containedPrimary': {
            boxShadow: '0 6px 16px rgba(240, 79, 120, 0.28)',
            '&:hover': { boxShadow: '0 8px 20px rgba(240, 79, 120, 0.34)' },
          },
          '&.MuiButton-outlinedPrimary': {
            backgroundColor: 'rgba(255, 253, 248, 0.72)',
            borderColor: 'rgba(240, 79, 120, 0.42)',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #ff6f91, #ed3f6b)',
          boxShadow: '0 8px 22px rgba(218, 56, 96, 0.34)',
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 700 } },
    },
    MuiDialog: {
      styleOverrides: { paper: { backgroundImage: 'linear-gradient(180deg, #fffdf8, #fff7ed)' } },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
