import React from 'react';
import { Box } from '@mui/material';
import './ImagePage.css';

export default function ImagePage() {
  return (
    <Box className="imagepage-container">
      <img src="/images/cryptoemogi.jpg" alt="Sidebar" className="imagepage-img" />
    </Box>
  );
}
