import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Paper, Tooltip } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PauseIcon from '@mui/icons-material/Pause';
import '@fontsource/roboto';

const Transcript = ({ newText }) => {
  const [transcript, setTranscript] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsRange, setTtsRange] = useState({ start: 0, end: 0 });
  const transcriptRef = useRef(null);
  const utteranceRef = useRef(null);

  // Update transcript with newText chunks
  useEffect(() => {
    if (newText) {
      const { response: dialog, sentiment, confidence } = newText;
      if (dialog) {
        setTranscript(prevTranscript => [
          ...prevTranscript,
          { dialog: dialog.replace(/["]+/g, ''), sentiment, confidence }
        ]);
      }
    }
  }, [newText]);

  // Auto scroll to the bottom on transcript update
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // Handle Text-to-Speech toggling
  const toggleTextToSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentWordIndex(null);
      setTtsRange({ start: 0, end: 0 });
    } else {
      startTextToSpeech();
    }
  };

  // Start Text-to-Speech and highlight words during playback
  const startTextToSpeech = () => {
    if (!transcript.length) return;

    const fullText = transcript.map(item => item.dialog).join(' ');
    const words = fullText.split(' ');

    setTtsRange({ start: 0, end: words.length });
    setIsSpeaking(true);

    utteranceRef.current = new SpeechSynthesisUtterance(fullText);
    utteranceRef.current.onboundary = (event) => {
      if (event.name === 'word') {
        const spokenWordIndex = words.findIndex(
          (_, idx) => event.charIndex <= words.slice(0, idx + 1).join(' ').length
        );
        setCurrentWordIndex(spokenWordIndex);
      }
    };

    utteranceRef.current.onend = () => {
      setIsSpeaking(false);
      setCurrentWordIndex(null);
      setTtsRange({ start: 0, end: 0 });
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utteranceRef.current);
  };

  const getHighlightedText = () => {
    if (!transcript.length) return 'Transcript will appear here...';
  
    return transcript.map((chunk, chunkIndex) => {
      const words = chunk.dialog.split(' ');
  
      return (
        <span
          key={`chunk-${chunkIndex}`}
          style={{
            display: 'inline-block',
            backgroundColor: 'transparent',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (chunk.sentiment === 'NoConf') {
              e.currentTarget.style.backgroundColor = '#ffcccc';
            }
          }}
          onMouseLeave={(e) => {
            if (chunk.sentiment === 'NoConf') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          {words.map((word, wordIndex) => {
            const globalIndex = transcript
              .slice(0, chunkIndex)
              .reduce((acc, cur) => acc + cur.dialog.split(' ').length, 0) + wordIndex;
  
            return (
              <Tooltip
              placement="right-start"
              key={`${chunkIndex}-${wordIndex}`}
              title={
                chunk.sentiment === 'NoConf' ? (
                  <Typography
                    variant="body2" // smaller text
                    sx={{
                      color: 'white',
                      fontWeight: 'medium',
                      textTransform: 'none',
                      letterSpacing: '0.5px',
                    }}
                  >
                    "We don't think we correctly interpreted this phrase. Make sure your face is visible, mouth movements are clear, and you're centered in the frame."
                  </Typography>
                ) : ''
              }
              arrow
            >
              <span
                style={{
                  backgroundColor: 
                    isSpeaking && globalIndex >= ttsRange.start && globalIndex < ttsRange.end
                      ? globalIndex === currentWordIndex
                        ? '#ffeb3b'
                        : '#f5f5dc'
                      : 'transparent',
                  textDecoration: chunk.sentiment === 'NoConf' ? 'underline wavy red' : 'none',
                  transition: 'background-color 0.3s ease'
                }}
              >
                {word}{' '}
              </span>
            </Tooltip>

            );
          })}
        </span>
      );
    });
  };
  
  

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          flex: 1,
          width: '100%',
          borderRadius: '16px',
          backgroundColor: '#f9f9f9',
          overflowY: 'auto',
          mb: 2,
        }}
      >
        <Box
          ref={transcriptRef}
          sx={{
            height: '100%',
            p: 3,
            whiteSpace: 'pre-line',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: '1rem',
              color: '#333'
            }}
          >
            {getHighlightedText()}
          </Typography>
        </Box>
      </Paper>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2
        }}
      >
        <IconButton
          onClick={toggleTextToSpeech}
          disabled={!transcript.length}
          sx={{
            backgroundColor: isSpeaking ? 'secondary.main' : 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: isSpeaking ? 'secondary.dark' : 'primary.dark',
            },
            '&:disabled': {
              backgroundColor: 'grey.400',
            },
            transition: 'background-color 0.3s ease',
            width: '50px',
            height: '50px',
            mr: 2
          }}
        >
          {isSpeaking ? (
            <PauseIcon sx={{ fontSize: 32 }} />
          ) : (
            <VolumeUpIcon sx={{ fontSize: 32 }} />
          )}
        </IconButton>
        <Typography
          variant="body1"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          Convert to Text-To-Speech
        </Typography>
      </Box>
    </Box>
  );
};

export default Transcript;
