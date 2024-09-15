import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography } from '@mui/material';
import VideoCapture from './VideoCapture';
import Transcript from './Transcript';
import logo from './resources/LOGO.png';
import { motion } from 'framer-motion';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#e74c3c',
    },
    background: {
      default: '#ecf0f1',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#2c3e50',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
});

const Content = () => {
    const [transcriptText, setTranscriptText] = useState('');
    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        >
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container maxWidth="lg">
                    <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 4,
                    }}
                    >
                    <Box
                        component="img"
                        src={logo}
                        alt="Logo"
                        sx={{
                        width: '200px',
                        height: 'auto',
                        mb: 4,
                        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
                        }}
                    />
                    <Typography variant="h1" gutterBottom>
                        DEMO
                    </Typography>
                    <VideoCapture setTranscriptText={setTranscriptText} />
                    <Transcript newText={transcriptText} />
                    </Box>
                </Container>
            </ThemeProvider>
        </motion.div>
    );
}

export default Content;