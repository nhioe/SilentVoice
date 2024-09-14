import React, { useEffect, useState, useRef } from 'react';

const VideoCapture = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [segmentCount, setSegmentCount] = useState(0); // To manage segment files

  const videoRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
  var segments = 0;

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
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current); // Clean up interval
      }
    };
  }, []);

  const startNewRecorder = (stream) => {
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    setMediaRecorder(recorder);

    recorder.ondataavailable = event => {
      if (event.data.size > 0) {
        console.log("DATA: ", event.data);
        // Append new data to recordedChunksRef
        recordedChunksRef.current = [...recordedChunksRef.current, event.data];
      }
    };

    recorder.onstop = () => {
      // console.log(recordedChunksRef.current.length);
      if (recordedChunksRef.current.length > 0) {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const filename = `video_segment_${segments}.webm`;
        uploadVideo(blob, filename);
        console.log("BLOBL", blob);
        // Clear recordedChunksRef for the next segment
        recordedChunksRef.current = [];
        setSegmentCount(segments); // Increment segment count
        segments = segments + 1;
        console.log(segments);
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

  const startRecording = () => {
    segments = 0;
    if (mediaRecorder) {
      setIsRecording(true);
      mediaRecorder.start(); // Start recording
      
      // Set up a recording interval to restart every 2000 ms
      recordingIntervalRef.current = setInterval(() => {
        if (mediaRecorder) {
          mediaRecorder.stop(); // Stop current recording
          //startNewRecorder(videoRef.current.srcObject); // Start new recording
          mediaRecorder.start(); // Start recording
        }
      }, 2000); // 2000ms = 2 seconds

      console.log('Recording started');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      setIsRecording(false);
      mediaRecorder.stop(); // Stop recording
      console.log('Recording stopped');

      // Clean up the recording interval
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
