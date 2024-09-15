import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Paper, Tooltip } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PauseIcon from '@mui/icons-material/Pause';

const Transcript = ({ newText }) => {
  const [transcript, setTranscript] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsRange, setTtsRange] = useState({ start: 0, end: 0 });
  const transcriptRef = useRef(null);
  const isUserScrolling = useRef(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (newText) {
      setTranscript(prevTranscript => prevTranscript + newText + ' ');
    }
  }, [newText]);

  useEffect(() => {
    if (!isUserScrolling.current && transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = transcriptRef.current;
    isUserScrolling.current = Math.abs(scrollHeight - scrollTop - clientHeight) > 10;
  };

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

  const startTextToSpeech = () => {
    if (!transcript) return;

    const words = transcript.trim().split(' ');
    setTtsRange({ start: 0, end: words.length });
    setIsSpeaking(true);

    utteranceRef.current = new SpeechSynthesisUtterance(transcript.trim());
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
    if (!transcript) return 'Transcript will appear here...';

    return transcript.trim().split(' ').map((word, index) => (
      <span
        key={index}
        style={{
          backgroundColor: 
            isSpeaking && index >= ttsRange.start && index < ttsRange.end
              ? index === currentWordIndex
                ? 'yellow'
                : 'rgba(255, 255, 0, 0.3)'
              : 'transparent',
          transition: 'background-color 0.3s ease'
        }}
      >
        {word}{' '}
      </span>
    ));
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
          onScroll={handleScroll}
          sx={{
            height: '100%',
            p: 3,
            whiteSpace: 'pre-line',
          }}
        >
          <Typography variant="body1">
            {getHighlightedText()}
          </Typography>
        </Box>
      </Paper>
      <Tooltip title={isSpeaking ? "Pause text-to-speech" : "Start text-to-speech"}>
        <IconButton
          onClick={toggleTextToSpeech}
          disabled={!transcript}
          sx={{
            alignSelf: 'center',
            backgroundColor: isSpeaking ? 'secondary.main' : 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: isSpeaking ? 'secondary.dark' : 'primary.dark',
            },
            '&:disabled': {
              backgroundColor: 'grey.400',
            },
            transition: 'background-color 0.3s ease',
            width: '60px',
            height: '60px',
          }}
        >
          {isSpeaking ? (
            <PauseIcon sx={{ fontSize: 32 }} />
          ) : (
            <VolumeUpIcon sx={{ fontSize: 32 }} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Transcript;
