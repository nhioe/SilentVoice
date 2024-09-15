import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, IconButton, Paper, Tooltip } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StopIcon from '@mui/icons-material/Stop';
import { motion } from 'framer-motion';

const VideoCapture = ({ setTranscriptText }) => {
  const clearErrors = [
    'No Speech Detected',
    'No Face Found',
    'Face detected was not longer than 1 second, please use a longer video.',
  ];

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [segmentCount, setSegmentCount] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);

  const videoRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
  let segments = 0;

  useEffect(() => {
    let stream;

    const setupStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        startNewRecorder(stream);
        setHasPermission(true);
      } catch (error) {
        console.error('Error accessing media devices.', error);
        setHasPermission(false);
      }
    };

    setupStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const startNewRecorder = (stream) => {
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    setMediaRecorder(recorder);

    recorder.ondataavailable = event => {
      if (event.data.size > 0) {
        recordedChunksRef.current = [...recordedChunksRef.current, event.data];
      }
    };

    recorder.onstop = () => {
      if (recordedChunksRef.current.length > 0) {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const filename = `video_segment_${segments}.webm`;
        uploadVideo(blob, filename);
        recordedChunksRef.current = [];
        setSegmentCount(segments);
        segments += 1;
      } else {
        console.warn('No recorded chunks available.');
      }
    };

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    segments = 0;
    if (mediaRecorder) {
      setIsRecording(true);
      mediaRecorder.start();
      
      recordingIntervalRef.current = setInterval(() => {
        if (mediaRecorder) {
          mediaRecorder.stop();
          mediaRecorder.start();
        }
      }, 5000);

      console.log('Recording started');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      setIsRecording(false);
      mediaRecorder.stop();
      console.log('Recording stopped');

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const uploadVideo = async (blob, filename) => {
    const formData = new FormData();
    formData.append('video', blob, filename);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Upload successful frontend:', data);
      let dialog = data.response;
      if (clearErrors.includes(dialog)) {
        console.log("Not printing error to transcript.");
      } else {
        setTranscriptText(data);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '620px', margin: '0 auto', mb: 4 }}>
      {hasPermission === false ? (
        <Typography variant="h6" color="error" align="center">
          Camera permission is not granted or there was an error accessing the camera.
        </Typography>
      ) : (
        <Paper elevation={6} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
          <Box sx={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
            <video
              ref={videoRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              autoPlay
              muted
            />
            {isRecording && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 30,
                  height: 30,
                  backgroundColor: 'red',
                  borderRadius: '50%',
                }}
              />
            )}
          </Box>
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(to right, #3b82f6, #283e7a)',
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'white', 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {isRecording ? 'Recording...' : 'Ready!'}
            </Typography>
            <Tooltip title={isRecording ? 'Stop Recording' : 'Start Recording'}>
              <IconButton
                onClick={toggleRecording}
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isRecording ? (
                  <StopIcon sx={{ fontSize: 24, color: '#e11d48' }} />
                ) : (
                  <FiberManualRecordIcon sx={{ fontSize: 24, color: '#3b82f6' }} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default VideoCapture;
