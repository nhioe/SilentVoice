/*
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
*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './Landing';
import Content from './Content';

const AppContent = () => {
  const location = useLocation(); // Needed for AnimatePresence to track location changes

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" exact element={<LandingPage/>} />
        <Route path="/demo" element={<Content/>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return(
    <Router>
      <AppContent />
    </Router>
  )
}


export default App;
