import React, { useEffect, useState, useRef } from 'react';

const VideoCapture = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const videoRef = useRef(null);
  const recordingIntervalRef = useRef(null); // Ref to hold the interval ID
  const [segmentCount, setSegmentCount] = useState(0); // To manage segment files

  useEffect(() => {
    let stream;

    const setupStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        startNewRecorder(stream); // Initialize with a new recorder
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    setupStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startNewRecorder = (stream) => {
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    setMediaRecorder(recorder);

    recorder.ondataavailable = event => {
      if (event.data.size > 0) {
        console.log
        setRecordedChunks(prevChunks => [...prevChunks, event.data]);
      }
    };

    recorder.onstop = () => {
      if (recordedChunks.length > 0) {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const filename = `video_segment_${segmentCount}.webm`;
        uploadVideo(blob, filename);
        setRecordedChunks([]); // Clear chunks for the next segment
        setSegmentCount(prevCount => prevCount + 1); // Increment segment count
      } else {
        console.warn('No recorded chunks available.');
      }
    };

    // Assign the stream to the video element
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current); // Clear any existing interval
    }

    recordingIntervalRef.current = setInterval(() => {
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        startNewRecorder(stream); // Start a new recorder for the next segment
      }
    }, 3000); // 3000ms = 3 seconds
  };

  const startRecording = () => {
    if (mediaRecorder) {
      setIsRecording(true);
      mediaRecorder.start();
      console.log('Recording started');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      setIsRecording(false);
      mediaRecorder.stop();
      console.log('Recording stopped');
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current); // Clear the recording interval
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
      console.log('Upload successful:', data);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay muted></video>
      <div>
        <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
        <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
      </div>
    </div>
  );
};

export default VideoCapture;
