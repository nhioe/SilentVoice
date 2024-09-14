
/*
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const Transcript = ({ newText }) => {
  const [transcript, setTranscript] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(null); // Track which word is currently being spoken
  const [isSpeaking, setIsSpeaking] = useState(false); // Track speaking state
  const transcriptRef = useRef(null); // For auto-scrolling
  const isUserScrolling = useRef(false); // To detect if the user is manually scrolling

  useEffect(() => {
    if (newText) {
      // Append new text to the existing transcript
      setTranscript(prevTranscript => prevTranscript + newText + ' ');
    }
  }, [newText]);

  useEffect(() => {
    if (!isUserScrolling.current && transcriptRef.current) {
      // Auto-scroll to the bottom when new text is added, if not manually scrolled
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = transcriptRef.current;
    // Detect if the user is manually scrolling
    if (Math.abs(scrollHeight - scrollTop - clientHeight) > 10) {
      isUserScrolling.current = true;
    } else {
      isUserScrolling.current = false;
    }
  };

  const handleTextToSpeech = () => {
    if (!transcript) return;

    const utterance = new SpeechSynthesisUtterance(transcript);
    const words = transcript.split(' ');

    setIsSpeaking(true);

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        // Determine which word is being spoken based on the character index
        const spokenWordIndex = words.findIndex(
          (_, idx) => event.charIndex <= words.slice(0, idx + 1).join(' ').length
        );
        setCurrentWordIndex(spokenWordIndex);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentWordIndex(null); // Reset highlight after speaking
    };

    // Start speech synthesis
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  const getHighlightedText = () => {
    if (!transcript) return 'Transcript will appear here...';

    return transcript.split(' ').map((word, index) => (
      <span
        key={index}
        style={{
          backgroundColor: index === currentWordIndex ? 'yellow' : 'transparent',
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
        width: '80%',        // Adjusted width to 80% of its parent container
        maxWidth: '600px',    // Limits the max width of the container
        margin: '0 auto',     // Center the box horizontally
        marginTop: '20px',    // Margin at the top
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          height: '200px',
          width: '100%', // Ensure the box takes the full width of its container
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          overflowY: 'auto',    // Allow scrolling if the text overflows
          whiteSpace: 'pre-line', // Preserve line breaks in the transcript
          marginBottom: '10px' // Margin between the text box and the button
        }}
        ref={transcriptRef} // Reference for auto-scrolling
        onScroll={handleScroll} // Track user scroll
      >
        <Typography variant="body1">
          {getHighlightedText()}
        </Typography>
      </Box>

        <IconButton
          onClick={handleTextToSpeech}
          disabled={!transcript || isSpeaking} // Disable the button if there's no transcript or it's currently speaking
          sx={{
            backgroundColor: isSpeaking ? '#1976d2' : 'lightblue', // Grey out when disabled
            color: isSpeaking ? 'white' : 'black',
            '&:hover': {
              backgroundColor: isSpeaking ? '#1976d2' : 'darkgrey',
              color: 'white'
            },
            transition: 'background-color 0.3s ease'
          }}
        >
          <VolumeUpIcon sx={{ fontSize: 28 }} />
        </IconButton>

    </Box>
  );
};

export default Transcript;
*/
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
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
        maxWidth: '600px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Paper
        elevation={6}
        sx={{
          height: '300px',
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
      <IconButton
        onClick={toggleTextToSpeech}
        disabled={!transcript}
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
    </Box>
  );
};

export default Transcript;