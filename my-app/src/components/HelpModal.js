import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import '../App.css';

const words = [
  "Welcome to Silent Voice, the live lip reading application!",
  "To ensure the highest accuracy, please follow these guidelines:",
  "1. Make sure the camera captures your entire face.",
  "2. Position yourself as close to the camera as possible without being out of view.",
  "3. Enunciate your words clearly for best results."
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
      maxWidth="md"
      sx={{ 
        '& .MuiDialogContent-root': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          textAlign: 'left',
        },
        '& .MuiDialog-paper': {
          backgroundColor: '#3259a6',
        }
      }}
    >
      <DialogTitle
        sx={{ 
          fontFamily: 'MyCustomFont', 
          fontSize: '2rem',    
          fontWeight: 'bold',    
          textAlign: 'center',
          color: '#000',           
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
            alignItems: 'left',
            textAlign: 'left',
            gap: '1em',
          }}
        >
          {words.map((word, index) => (
            <motion.div
              key={index}
              variants={wordVariants}
              className="help-modal-content"  
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
