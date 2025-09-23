import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Box, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, Checkbox, FormControlLabel, Alert, Snackbar } from '@mui/material';
import { Typography } from '@mui/material';
import Plan from './Plan';
import Earnings from './Earnings';
import Home from './Home';
import AdminDashboard from './AdminDashboard';
import { TextField, Button } from '@mui/material';
// Registration is embedded in the login dialog; no separate Register component/route
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

const DAILY_PROFIT_PERCENT = 5;
function calculateProfit(amount) {
  return (amount * DAILY_PROFIT_PERCENT) / 100;
}

function App() {
  const [deposit, setDeposit] = useState('');
  const [deposits, setDeposits] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [pendingReferrerId, setPendingReferrerId] = useState(null);
  const [commissionHistory, setCommissionHistory] = useState([]); // {id, inviterId, invitedId, amount, commission, date}
  const [anchorEl, setAnchorEl] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState('user');
  const [adminMode, setAdminMode] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  // Intentionally no persistence for login state and role
  const navigate = useNavigate();
  const location = useLocation();

  // Capture referral code from URL (?ref=USER_ID)
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      setPendingReferrerId(ref);
    }
  }, [location.search]);

  const handleLogin = () => {
    setLoginError('');
    if (!isRegisterMode) {
      if (!username || !password) {
        setLoginError("Veuillez entrer un email et un mot de passe.");
        return;
      }
    }
    // If user mode, validate against in-memory users
    if (!adminMode && !isRegisterMode) {
      const found = users.find((u) => u.email === String(username).toLowerCase());
      if (!found || found.password !== password) {
        setLoginError('Identifiants invalides.');
        return;
      }
      setCurrentUserId(found.id);
    }
    if (adminMode) {
      const ADMIN_USER = process.env.REACT_APP_ADMIN_USER || 'admin';
      const ADMIN_PASS = process.env.REACT_APP_ADMIN_PASS || 'admin123';
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        setLoggedIn(true);
        setRole('admin');
        setLoginOpen(false);
        return;
      }
      setLoginError('Identifiants administrateur invalides.');
      return;
    }
    // regular user login
    if (!isRegisterMode) {
      setLoggedIn(true);
      setRole('user');
      setLoginOpen(false);
    }
  };

  const handleRegister = () => {
    setLoginError('');
    // basic validation
    const email = regEmail.trim().toLowerCase();
    if (!regFullName.trim()) { setLoginError('Veuillez entrer votre nom complet.'); return; }
    if (!email) { setLoginError('Veuillez entrer votre email.'); return; }
    if (!/.+@.+\..+/.test(email)) { setLoginError('Adresse email invalide.'); return; }
    const phone = regPhone.trim();
    if (!phone) { setLoginError('Veuillez entrer votre numéro de téléphone.'); return; }
    if (!/^\+?[0-9\s-]{7,15}$/.test(phone)) { setLoginError('Numéro de téléphone invalide.'); return; }
    if (!regPassword) { setLoginError('Veuillez entrer un mot de passe.'); return; }
    if (regPassword.length < 6) { setLoginError('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    if (regPassword !== regConfirm) { setLoginError('Les mots de passe ne correspondent pas.'); return; }
    const exists = users.some((u) => u.email === email);
    if (exists) { setLoginError('Un utilisateur avec cet email existe déjà.'); return; }
    const newUser = { id: Date.now().toString(), fullName: regFullName.trim(), email, phone, password: regPassword, invitedById: pendingReferrerId || null, commissionBalance: 0 };
    setUsers([...users, newUser]);
    // auto-login after registration
    setLoggedIn(true);
    setRole('user');
    setCurrentUserId(newUser.id);
    setLoginOpen(false);
    // clear registration fields
    setRegFullName(''); setRegEmail(''); setRegPhone(''); setRegPassword(''); setRegConfirm('');
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
    setLoginError('');
  };

  const handleDeposit = (data) => {
    if (data && typeof data === 'object' && data.amount) {
      const newDeposit = {
        amount: data.amount,
        plan: data.plan,
        percent: data.percent,
        date: new Date().toLocaleDateString(),
        profit: (data.amount * data.percent) / 100
      };
      setDeposits([...deposits, newDeposit]);
      // Award referral commission (5%) to inviter of current user if exists
      if (currentUserId) {
        const me = users.find(u => u.id === currentUserId);
        const inviterId = me?.invitedById || null;
        if (inviterId) {
          const commission = Number(data.amount) * 0.05;
          setUsers(users.map(u => u.id === inviterId ? { ...u, commissionBalance: (u.commissionBalance || 0) + commission } : u));
          setCommissionHistory([
            ...commissionHistory,
            {
              id: Date.now().toString(),
              inviterId,
              invitedId: currentUserId,
              amount: Number(data.amount),
              commission,
              date: new Date().toLocaleDateString()
            }
          ]);
          setSnackMessage(`Commission de $${commission.toFixed(2)} créditée.`);
          setSnackOpen(true);
        }
      }
      setDeposit('');
      return;
    }
    const amount = parseFloat(deposit);
    if (!isNaN(amount) && amount > 0) {
      setDeposits([...deposits, { amount, date: new Date().toLocaleDateString(), profit: calculateProfit(amount) }]);
      // Also award commission for manual deposit
      if (currentUserId) {
        const me = users.find(u => u.id === currentUserId);
        const inviterId = me?.invitedById || null;
        if (inviterId) {
          const commission = amount * 0.05;
          setUsers(users.map(u => u.id === inviterId ? { ...u, commissionBalance: (u.commissionBalance || 0) + commission } : u));
          setCommissionHistory([
            ...commissionHistory,
            {
              id: Date.now().toString(),
              inviterId,
              invitedId: currentUserId,
              amount,
              commission,
              date: new Date().toLocaleDateString()
            }
          ]);
          setSnackMessage(`Commission de $${commission.toFixed(2)} créditée.`);
          setSnackOpen(true);
        }
      }
      setDeposit('');
    }
  };

  const handleLoginOpen = () => {
    setLoginOpen(true);
    setAnchorEl(null);
  };
  const handleWithdrawCommission = (amount) => {
    if (!currentUserId || !amount || amount <= 0) return false;
    const me = users.find(u => u.id === currentUserId);
    if (!me) return false;
    const balance = me.commissionBalance || 0;
    if (amount > balance) return false;
    const updatedUsers = users.map(u => u.id === currentUserId ? { ...u, commissionBalance: balance - amount } : u);
    setUsers(updatedUsers);
    // Optionally record payout in history (negative commission)
    setCommissionHistory([
      ...commissionHistory,
      {
        id: Date.now().toString(),
        inviterId: currentUserId,
        invitedId: null,
        amount: 0,
        commission: -amount,
        date: new Date().toLocaleDateString()
      }
    ]);
    return true;
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
              {!loggedIn ? (
                <MenuItem onClick={() => { handleClose(); handleLoginOpen(); }}>Se connecter</MenuItem>
              ) : (
                <>
                  {role === 'admin' ? (
                    <MenuItem onClick={() => { navigate('/admin'); handleClose(); }}>Admin</MenuItem>
                  ) : null}
                  <MenuItem onClick={() => { setLoggedIn(false); setRole('user'); setCurrentUserId(null); handleClose(); }}>Se déconnecter</MenuItem>
                </>
              )}
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
              element={<Earnings 
                deposits={deposits} 
                dailyProfitPercent={DAILY_PROFIT_PERCENT}
                inviteLink={`${window.location.origin}/?ref=${currentUserId || ''}`}
                commissionBalance={(users.find(u => u.id === currentUserId)?.commissionBalance) || 0}
                commissionHistory={commissionHistory.filter(c => c.inviterId === currentUserId)}
                onWithdrawCommission={handleWithdrawCommission}
                referralCount={users.filter(u => u.invitedById === (currentUserId || ''))?.length || 0}
              />} 
            />
            <Route 
              path="/admin" 
              element={loggedIn && role === 'admin' ? (
                <AdminDashboard deposits={deposits} users={users} />
              ) : (
                <Navigate to="/" replace />
              )}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
        <Dialog open={loginOpen} onClose={handleLoginClose}>
          <DialogTitle>{isRegisterMode ? "Créer un compte" : "Connexion"}</DialogTitle>
          <DialogContent>
            {isRegisterMode ? (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Nom complet"
                  type="text"
                  fullWidth
                  value={regFullName}
                  onChange={e => setRegFullName(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="Email"
                  type="email"
                  fullWidth
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="Téléphone"
                  type="tel"
                  fullWidth
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="Mot de passe"
                  type="password"
                  fullWidth
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="Confirmer le mot de passe"
                  type="password"
                  fullWidth
                  value={regConfirm}
                  onChange={e => setRegConfirm(e.target.value)}
                />
              </>
            ) : (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  label={adminMode ? "Nom d'utilisateur" : "Email"}
                  type={adminMode ? "text" : "email"}
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
                <FormControlLabel
                  control={<Checkbox checked={adminMode} onChange={(e) => setAdminMode(e.target.checked)} />}
                  label="Se connecter en tant qu'admin"
                  sx={{ mt: 1 }}
                />
              </>
            )}
            {loginError ? (
              <Alert severity="error" sx={{ mt: 2 }}>{loginError}</Alert>
            ) : null}
            <Box sx={{ mt: 2 }}>
              {isRegisterMode ? (
                <Button variant="text" onClick={() => { setIsRegisterMode(false); setLoginError(''); }}>
                  Déjà un compte ? Se connecter
                </Button>
              ) : (
                <Button variant="text" onClick={() => { setIsRegisterMode(true); setAdminMode(false); setLoginError(''); }}>
                  Créer un compte
                </Button>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLoginClose}>Annuler</Button>
            {isRegisterMode ? (
              <Button onClick={handleRegister} variant="contained" color="primary">S'inscrire</Button>
            ) : (
              <Button onClick={handleLogin} variant="contained" color="primary">Se connecter</Button>
            )}
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackOpen}
          autoHideDuration={3000}
          onClose={() => setSnackOpen(false)}
          message={snackMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
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
