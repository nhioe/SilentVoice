/*
import './App.css';
import VideoCapture from './VideoCapture';
import Transcript from './Transcript';
import { useEffect, useState } from 'react';
import logo from './resources/LOGO.png'; // Adjust the path as needed

function App() {
  const [transcriptText, setTranscriptText] = useState(''); // State to hold the transcript text
  return (
    <div className="App">
      <div className="background"></div>
      <div className="content">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h1>DEMO</h1>
      <VideoCapture setTranscriptText={setTranscriptText} />
      <Transcript newText={transcriptText} />
    </div>
  );
}

export default App;
*/
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography } from '@mui/material';
import VideoCapture from './VideoCapture';
import Transcript from './Transcript';
import logo from './resources/LOGO.png';

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

function App() {
  const [transcriptText, setTranscriptText] = useState('');

  return (
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
  );
}

export default App;
