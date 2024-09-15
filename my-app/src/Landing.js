import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2dd4bf',
    },
    background: {
      default: '#0f172a',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 900,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const LandingPage = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();
  
    const handleGetStartedClick = () => {
      setIsAnimating(true);
  
      setTimeout(() => {
        navigate('/demo');
      }, 500); 
    };

  return (
    <motion.div
    initial={{ opacity: 1 }}
    animate={{ opacity: isAnimating ? 0 : 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    >
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
            sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.palette.background.default,
            padding: 4,
            }}
        >
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: { xs: 4, sm: 6, md: 8 },
            }}
            >
            <Typography 
                variant="h1" 
                component="span" 
                sx={{ 
                fontSize: { xs: '3rem', sm: '5rem', md: '7rem' },
                color: 'white',
                fontWeight: 900,
                letterSpacing: '0.5em',
                marginRight: '-0.5em',
                textAlign: 'center',
                lineHeight: 1.2,
                }}
            >
                SILENT
            </Typography>
            <Typography 
                variant="h1" 
                component="span" 
                sx={{ 
                fontSize: { xs: '3rem', sm: '5rem', md: '7rem' },
                color: theme.palette.primary.main,
                fontWeight: 900,
                letterSpacing: '0.5em',
                marginRight: '-0.5em',
                textAlign: 'center',
                lineHeight: 1.2,
                }}
            >
                VOICE
            </Typography>
            </Box>
            <Button
            onClick={handleGetStartedClick}
            variant="contained"
            size="large"
            sx={{
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                padding: { xs: '12px 24px', sm: '16px 32px', md: '20px 40px' },
                borderRadius: '9999px',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.default,
                fontWeight: 'bold',
                '&:hover': {
                backgroundColor: '#14b8a6',
                },
                boxShadow: '0 10px 15px -3px rgba(45, 212, 191, 0.2), 0 4px 6px -2px rgba(45, 212, 191, 0.1)',
            }}
            >
            Try Now
            </Button>
        </Box>
        </ThemeProvider>
    </motion.div>
  );
}

export default LandingPage;