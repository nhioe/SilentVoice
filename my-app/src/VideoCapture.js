import React, { useEffect, useState, useRef } from 'react';

const VideoCapture = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);  // Use ref for video element

  useEffect(() => {
    let stream;

    const setupStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = event => {
          if (event.data.size > 0) {
            setRecordedChunks(prevChunks => [...prevChunks, event.data]);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'video/mp4' });
          uploadVideo(blob);
        };

        // Assign the stream to the video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(error => {
            console.error('Error playing video:', error);
          });
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    setupStream();

    return () => {
      // Cleanup: Stop all tracks and release resources
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [recordedChunks]); // Dependency on recordedChunks to ensure it captures updates

  const startRecording = () => {
    if (mediaRecorder) {
      setRecordedChunks([]);  // Reset recorded chunks
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const uploadVideo = async (blob) => {
    const formData = new FormData();
    formData.append('video', blob, 'video.mp4');

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
