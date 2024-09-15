import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import VideoCapture from './VideoCapture';
import Transcript from './Transcript';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HelpModal from './HelpModal';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2dd4bf',
    },
    background: {
      default: '#f3f4f6',
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
  const [openHelp, setOpenHelp] = useState(false);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleHelpClick = () => {
    setOpenHelp(true);
  };

  const handleCloseHelp = () => {
    setOpenHelp(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <IconButton
            onClick={handleHomeClick}
            sx={{
              position: 'fixed',
              top: 16,
              left: 16,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              zIndex: 1200,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            <HomeIcon />
          </IconButton>
          <IconButton
            onClick={handleHelpClick}
            sx={{
              position: 'fixed',
              bottom: 16,
              left: 16,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              zIndex: 1200,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            <HelpOutlineIcon />
          </IconButton>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
            gap={4}
            sx={{ mt: 4 }}
          >
            <Box
              sx={{
                flex: '0 0 auto',
                width: '620px',
                height: '800px',
                position: 'relative',
                ml: 6,
              }}
            >
              <VideoCapture setTranscriptText={setTranscriptText} />
            </Box>
            <Box
              sx={{
                flex: '1 1 auto',
                maxWidth: '30vw',
                maxHeight: '80vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '300px',
                height: '80vh',
                zIndex: 1,
              }}
            >
              <Transcript newText={transcriptText} />
            </Box>
          </Box>
        </Container>
        <HelpModal open={openHelp} onClose={handleCloseHelp} />
      </ThemeProvider>
    </motion.div>
  );
}

export default Content;
