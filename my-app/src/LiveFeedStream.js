import React, { useRef, useState } from 'react';

const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const chunks = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setVideoBlob(blob);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const uploadVideo = () => {
    if (!videoBlob) return;

    const formData = new FormData();
    formData.append('video', videoBlob, 'video.webm');

    fetch('https://your-server-url/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.text())
    .then(result => console.log('Upload successful:', result))
    .catch(error => console.error('Upload failed:', error));
  };

  return (
    <div>
      <video ref={videoRef} width="640" height="480" controls></video>
      {recording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}
      {videoBlob && <button onClick={uploadVideo}>Upload Video</button>}
    </div>
  );
};

export default VideoRecorder;
