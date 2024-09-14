import './App.css';
import VideoCapture from './VideoCapture';
import Transcript from './Transcript';
import { useEffect, useState } from 'react';
import logo from './resources/LOGO.png'; // Adjust the path as needed

function App() {
  const [transcriptText, setTranscriptText] = useState(''); // State to hold the transcript text
  return (
    <div className="App">
      <div className="background"></div>
      <div className="content">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h1>DEMO</h1>
      <VideoCapture setTranscriptText={setTranscriptText} />
      <Transcript newText={transcriptText} />
    </div>
  );
}

export default App;
