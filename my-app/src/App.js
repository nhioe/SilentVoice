import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/Landing';
import Content from './components/Content';

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
