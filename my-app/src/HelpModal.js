import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import './App.css'; // Import your CSS here which includes font imports

const words = [
  "Welcome to Silent Voice, the live feed lip reading application.",
  "For maximal accuracy, ensure the following:",
  "Make sure the camera can see your full face.",
  "If possible, ensure your face is as close to the camera as possible (without being unvisible).",
  "Announce your words clearly -- it helps lots!",
];

const wordVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const HelpModal = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      sx={{ 
        '& .MuiDialogContent-root': { // Center content
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        },
        '& .MuiDialog-paper': { // Set darker background color
          backgroundColor: '#3259a6', // Darker background color
        }
      }}
    >
      <DialogTitle
        sx={{ 
          fontFamily: 'MyCustomFont', // Use your custom font
          fontSize: '2rem',        // Adjust the font size
          fontWeight: 'bold',      // Make it bold
          textAlign: 'center',
          color: '#000',           // Change text color to black
          position: 'relative',
        }}
      >
        Help & Instructions
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.3, duration: 1, ease: 'easeOut' }}
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1em',
          }}
        >
          {words.map((word, index) => (
            <motion.div
              key={index}
              variants={wordVariants}
              className="help-modal-content"  // Apply custom class
            >
              {word}
            </motion.div>
          ))}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
