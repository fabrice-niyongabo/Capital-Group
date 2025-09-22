import React from 'react';
import { Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import './Sidebar.css';


export default function Sidebar() {
  return (
    <Drawer variant="permanent" anchor="left" className="sidebar-drawer">
      <Box sx={{ width: 240, height: '100vh', bgcolor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
        <img src="/images/cryptoemogi.jpg" alt="Crypto Emoji" style={{ width: '80%', borderRadius: 12, marginBottom: 24 }} />
      </Box>
    </Drawer>
  );
}
