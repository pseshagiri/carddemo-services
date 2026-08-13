import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './auth/AuthContext';
import AppRouter from './router/AppRouter';

// GOV.UK Design System colour palette
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1d70b8' },      // govuk-link-colour
    secondary: { main: '#0b0c0c' },    // govuk-text-colour
    error: { main: '#d4351c' },        // govuk-error-colour
    success: { main: '#00703c' },      // govuk-success-colour
    background: { default: '#f3f2f1', paper: '#ffffff' },
    text: { primary: '#0b0c0c', secondary: '#505a5f' }
  },
  shape: { borderRadius: 0 },          // GOV.UK uses no border-radius
  typography: {
    fontFamily: `"GDS Transport", Arial, sans-serif`,
    button: { textTransform: 'none', fontWeight: 700 }
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 0 } } },
    MuiTextField: { styleOverrides: { root: { borderRadius: 0 } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 0 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 0 } } }
  }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}
