import React, { useState, useRef, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Grid,
  Button,
  IconButton,
  Slider,
  Switch,
  FormControlLabel,
  Box,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  Settings,
  VolumeUp,
} from '@mui/icons-material';

const theme = createTheme({
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default function EnhancedLiveFeedApp() {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [volume, setVolume] = useState(30);
  const [showSettings, setShowSettings] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error("Error accessing the webcam", err));
    }
  }, []);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTranscript("Recording started. This is a simulated transcript that would be updated in real-time based on the lip reading API's output.");
    } else {
      setTranscript(transcript + "\n\nRecording stopped. The full transcript would be available here.");
    }
  };

  const handleTextToSpeech = () => {
    console.log("Text-to-speech activated");
    // Implement text-to-speech logic here
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, height: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              🎥 LiveFeed Pro
            </Typography>
            <IconButton color="inherit" onClick={() => setShowSettings(!showSettings)}>
              <Settings />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={3} 
                sx={{ 
                  position: 'relative', 
                  height: 0, 
                  paddingTop: '56.25%', // 16:9 aspect ratio
                  bgcolor: 'black',
                  overflow: 'hidden',
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted={isMuted}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {!isVideoEnabled && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                    }}
                  >
                    <Typography variant="h4" color="white">
                      Video Disabled
                    </Typography>
                  </Box>
                )}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 16, 
                    left: 16, 
                    right: 16, 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <IconButton 
                    color="primary" 
                    onClick={() => setIsMuted(!isMuted)}
                    sx={{ bgcolor: 'background.paper' }}
                  >
                    {isMuted ? <MicOff /> : <Mic />}
                  </IconButton>
                  <IconButton 
                    color="primary" 
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    sx={{ bgcolor: 'background.paper' }}
                  >
                    {isVideoEnabled ? <Videocam /> : <VideocamOff />}
                  </IconButton>
                </Box>
              </Paper>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <VolumeUp />
                <Slider 
                  value={volume} 
                  onChange={(_, newValue) => setVolume(newValue)} 
                  aria-labelledby="continuous-slider" 
                  valueLabelDisplay="auto"
                  sx={{ mx: 2 }}
                />
                <Typography variant="body2">
                  {volume}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  Controls & Transcript
                </Typography>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="contained"
                    color={isRecording ? "secondary" : "primary"}
                    onClick={toggleRecording}
                    startIcon={isRecording ? <MicOff /> : <Mic />}
                    sx={{ px: 3, py: 1 }}
                  >
                    {isRecording ? 'Stop' : 'Start'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleTextToSpeech}
                    startIcon={<VolumeUp />}
                    sx={{ px: 3, py: 1 }}
                  >
                    Speak
                  </Button>
                </Box>
                <Typography variant="subtitle2" gutterBottom>
                  Transcript:
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    flexGrow: 1, 
                    overflowY: 'auto', 
                    p: 2, 
                    bgcolor: 'grey.100', 
                    '& p': { mb: 1 } 
                  }}
                >
                  {transcript.split('\n').map((line, index) => (
                    <Typography key={index} variant="body2">
                      {line}
                    </Typography>
                  ))}
                </Paper>
              </Paper>
            </Grid>
          </Grid>
          {showSettings && (
            <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Settings
              </Typography>
              <FormControlLabel
                control={<Switch checked={isVideoEnabled} onChange={() => setIsVideoEnabled(!isVideoEnabled)} />}
                label="Enable Video"
              />
              <FormControlLabel
                control={<Switch checked={!isMuted} onChange={() => setIsMuted(!isMuted)} />}
                label="Enable Audio"
              />
            </Paper>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}