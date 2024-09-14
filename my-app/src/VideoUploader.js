import React, { useState } from 'react';

const VideoUploader = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch("https://symphoniclabs--symphonet-vsr-modal-htn-model-upload-static-htn.modal.run", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.text();
      setUploadStatus(`Upload successful: ${result}`);
    } catch (error) {
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="video/*" 
        onChange={handleFileChange} 
      />
      <button onClick={handleUpload}>Upload Video</button>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default VideoUploader;
