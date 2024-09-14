import React, { useEffect, useState, useRef } from 'react';

const VideoCapture = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const videoRef = useRef(null);
  const chunkDuration = 3000; // Duration of each chunk in milliseconds
  const chunkTimerRef = useRef(null); // Use a ref to store the timer ID

  useEffect(() => {
    let stream;

    const setupStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        setMediaRecorder(recorder);

        recorder.ondataavailable = event => {
          if (event.data.size > 0) {
            setRecordedChunks(prevChunks => [...prevChunks, event.data]);
          }
        };

        recorder.onstop = () => {
          if (recordedChunks.length > 0) {
            // Split the recorded chunks into separate blobs
            splitAndUploadChunks();
            setRecordedChunks([]); // Clear chunks after upload
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
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    setupStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (chunkTimerRef.current) {
        clearInterval(chunkTimerRef.current);
      }
    };
  }, [recordedChunks]);

  const startRecording = () => {
    if (mediaRecorder) {
      setRecordedChunks([]);
      mediaRecorder.start();
      setIsRecording(true);
      console.log('Recording started');
      
      // Set up a timer to split the video into chunks
      chunkTimerRef.current = setInterval(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.requestData(); // Request a new chunk
        }
      }, chunkDuration);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      console.log('Recording stopped');
      if (chunkTimerRef.current) {
        clearInterval(chunkTimerRef.current);
      }
    }
  };

  const splitAndUploadChunks = async () => {
    // Assuming that recordedChunks contains the chunks in the correct order
    let chunkStart = 0;

    while (chunkStart < recordedChunks.length) {
      // Create a new Blob for each chunk
      const chunk = new Blob(recordedChunks.slice(chunkStart, chunkStart + 1), { type: 'video/webm' });
      console.log('Uploading chunk:', chunk);
      await uploadVideo(chunk);
      chunkStart += 1;
    }
  };

  const uploadVideo = async (blob) => {
    const formData = new FormData();
    formData.append('video', blob, 'video.webm');

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
