import React, { useEffect, useState, useRef } from 'react';

const VideoTest = () => {
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
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current); // Clear interval on component unmount
      }
    };
  }, []);

  const startNewRecorder = (stream) => {
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    setMediaRecorder(recorder);

    recorder.ondataavailable = event => {
      if (event.data.size > 0) {
        console.log('Data available:', event.data);
        setRecordedChunks(prevChunks => [...prevChunks, event.data]);
      }
    };

    recorder.onstart = () => {
      console.log('MediaRecorder started');
    };

    recorder.onstop = () => {
      console.log('MediaRecorder stopped');
    };

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  };

  const startRecording = () => {
    if (mediaRecorder) {
      setIsRecording(true);
      mediaRecorder.start();
      console.log('Recording started');

      recordingIntervalRef.current = setInterval(() => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.requestData(); // Request recorded data every 3 seconds
        }
      }, 3000);
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
    console.log("Attempting upload of ", filename);
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

  // Call this function to handle chunk uploads and segment count updates
  const handleChunkUpload = () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const filename = `video_segment_${segmentCount}.webm`;
      uploadVideo(blob, filename);
      setSegmentCount(prevCount => prevCount + 1); // Increment segment count after upload
      setRecordedChunks([]); // Clear chunks after upload
    }
  };

  useEffect(() => {
    handleChunkUpload(); // Upload chunks periodically
  }, [recordedChunks]);

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

export default VideoTest;
