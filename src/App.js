import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Box, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab } from '@mui/material';
import { Typography } from '@mui/material';
import Home from './Home';
import Plan from './Plan';
import Earnings from './Earnings';
import { TextField, Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

const DAILY_PROFIT_PERCENT = 5;
function calculateProfit(amount) {
  return (amount * DAILY_PROFIT_PERCENT) / 100;
}

function App() {
  const [deposit, setDeposit] = useState('');
  const [deposits, setDeposits] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    if (username && password) {
      setLoggedIn(true);
      setLoginOpen(false);
    } else {
      alert("Veuillez entrer un nom d'utilisateur et un mot de passe.");
    }
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  const handleDeposit = (data) => {
    if (data && typeof data === 'object' && data.amount) {
      setDeposits([
        ...deposits,
        {
          amount: data.amount,
          plan: data.plan,
          percent: data.percent,
          date: new Date().toLocaleDateString(),
          profit: (data.amount * data.percent) / 100
        }
      ]);
      setDeposit('');
      return;
    }
    const amount = parseFloat(deposit);
    if (!isNaN(amount) && amount > 0) {
      setDeposits([...deposits, { amount, date: new Date().toLocaleDateString(), profit: calculateProfit(amount) }]);
      setDeposit('');
    }
  };

  const handleLoginOpen = () => {
    setLoginOpen(true);
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const tabs = [
    { path: '/', label: 'Accueil' },
    { path: '/plan', label: 'Plan' },
    { path: '/earnings', label: 'Gains' }
  ];

  return (
    <>
      <div className="background-img"></div>
      <Box sx={{ minHeight: '100vh' }}>
        <AppBar position="static" sx={{ width: '100%' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              CaPiTaL GrOuP
            </Typography>
            <Tabs 
              value={location.pathname === '/' ? '/' : location.pathname}
              onChange={(e, value) => navigate(value)}
              textColor="inherit"
              indicatorColor="secondary"
              sx={{ mr: 1, '& .MuiTab-root': { fontFamily: 'Lato, "Space Mono", Poppins, sans-serif', fontWeight: 600, letterSpacing: 0.2 } }}
            >
              {tabs.map(tab => (
                <Tab key={tab.path} value={tab.path} label={tab.label} sx={{ mx: 0.5, minWidth: 0 }} />
              ))}
            </Tabs>
            <IconButton
              size="large"
              aria-label="compte utilisateur"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {loggedIn ? (<MenuItem onClick={() => { setLoggedIn(false); handleClose(); }}>Se déconnecter</MenuItem>) : null}
            </Menu>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3, pb: 8, maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/plan" 
              element={
                <Plan
                  deposit={deposit}
                  setDeposit={setDeposit}
                  deposits={deposits}
                  handleDeposit={handleDeposit}
                />
              } 
            />
            <Route 
              path="/earnings" 
              element={<Earnings deposits={deposits} dailyProfitPercent={DAILY_PROFIT_PERCENT} />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
        <Dialog open={loginOpen} onClose={handleLoginClose}>
          <DialogTitle>Connexion</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nom d'utilisateur"
              type="text"
              fullWidth
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Mot de passe"
              type="password"
              fullWidth
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLoginClose}>Annuler</Button>
            <Button onClick={handleLogin} variant="contained" color="primary">Se connecter</Button>
          </DialogActions>
        </Dialog>
        <Box component="footer" sx={{ py: 2, textAlign: 'center', bgcolor: '#f5f5f5', position: 'fixed', left: 0, bottom: 0, width: '100%', fontFamily: 'Lato, "Space Mono", Poppins, sans-serif' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'inherit', fontWeight: 600 }}>
            © 2025 par Capital Group. Tous droits réservés.
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default App;
