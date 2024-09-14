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
