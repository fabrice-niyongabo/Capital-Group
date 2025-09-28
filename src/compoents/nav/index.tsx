import { AccountCircle } from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store/reducers";

function Nav() {
  const { showLogin } = useSelector((state: RootState) => state.appReducer);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("user");
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUserId, setCurrentUserId] = useState<any>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const [adminMode, setAdminMode] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [pendingReferrerId, setPendingReferrerId] = useState(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  // login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const tabs = [
    { path: "/", label: "Accueil" },
    { path: "/plan", label: "Plan" },
    { path: "/earnings", label: "Gains" },
  ];

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLoginOpen = () => {
    setLoginOpen(true);
    setAnchorEl(null);
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
    setLoginError("");
  };

  const handleRegister = () => {
    setLoginError("");
    // basic validation
    const email = regEmail.trim().toLowerCase();
    if (!regFullName.trim()) {
      setLoginError("Veuillez entrer votre nom complet.");
      return;
    }
    if (!email) {
      setLoginError("Veuillez entrer votre email.");
      return;
    }
    if (!/.+@.+\..+/.test(email)) {
      setLoginError("Adresse email invalide.");
      return;
    }
    const phone = regPhone.trim();
    if (!phone) {
      setLoginError("Veuillez entrer votre numéro de téléphone.");
      return;
    }
    if (!/^\+?[0-9\s-]{7,15}$/.test(phone)) {
      setLoginError("Numéro de téléphone invalide.");
      return;
    }
    if (!regPassword) {
      setLoginError("Veuillez entrer un mot de passe.");
      return;
    }
    if (regPassword.length < 6) {
      setLoginError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (regPassword !== regConfirm) {
      setLoginError("Les mots de passe ne correspondent pas.");
      return;
    }
    const exists = users.some((u) => u.email === email);
    if (exists) {
      setLoginError("Un utilisateur avec cet email existe déjà.");
      return;
    }
    const newUser = {
      id: Date.now().toString(),
      fullName: regFullName.trim(),
      email,
      phone,
      password: regPassword,
      invitedById: pendingReferrerId || null,
      commissionBalance: 0,
    };
    setUsers([...users, newUser]);
    // auto-login after registration
    setLoggedIn(true);
    setRole("user");
    setCurrentUserId(newUser.id);
    setLoginOpen(false);
    // clear registration fields
    setRegFullName("");
    setRegEmail("");
    setRegPhone("");
    setRegPassword("");
    setRegConfirm("");
  };

  const handleLogin = () => {
    setLoginError("");
    if (!isRegisterMode) {
      if (!username || !password) {
        setLoginError("Veuillez entrer un email et un mot de passe.");
        return;
      }
    }
    // If user mode, validate against in-memory users
    if (!adminMode && !isRegisterMode) {
      const found = users.find(
        (u) => u.email === String(username).toLowerCase()
      );
      if (!found || found.password !== password) {
        setLoginError("Identifiants invalides.");
        return;
      }
      setCurrentUserId(found.id);
    }
    if (adminMode) {
      const ADMIN_USER = process.env.REACT_APP_ADMIN_USER || "admin";
      const ADMIN_PASS = process.env.REACT_APP_ADMIN_PASS || "admin123";
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        setLoggedIn(true);
        setRole("admin");
        setLoginOpen(false);
        return;
      }
      setLoginError("Identifiants administrateur invalides.");
      return;
    }
    // regular user login
    if (!isRegisterMode) {
      setLoggedIn(true);
      setRole("user");
      setLoginOpen(false);
    }
  };

  useEffect(() => {
    if (showLogin) {
      handleLoginOpen();
    } else {
      handleLoginClose();
    }
  }, [showLogin]);

  return (
    <>
      <AppBar position="static" sx={{ width: "100%" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CaPiTaL GrOuP
          </Typography>
          <Tabs
            value={location.pathname === "/" ? "/" : location.pathname}
            onChange={(e, value) => navigate(value)}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              mr: 1,
              "& .MuiTab-root": {
                fontFamily: 'Lato, "Space Mono", Poppins, sans-serif',
                fontWeight: 600,
                letterSpacing: 0.2,
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.path}
                value={tab.path}
                label={tab.label}
                sx={{ mx: 0.5, minWidth: 0 }}
              />
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
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {!loggedIn ? (
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleLoginOpen();
                }}
              >
                Se connecter
              </MenuItem>
            ) : (
              <>
                {role === "admin" ? (
                  <MenuItem
                    onClick={() => {
                      navigate("/admin");
                      handleClose();
                    }}
                  >
                    Admin
                  </MenuItem>
                ) : null}
                <MenuItem
                  onClick={() => {
                    setLoggedIn(false);
                    setRole("user");
                    setCurrentUserId(null);
                    handleClose();
                  }}
                >
                  Se déconnecter
                </MenuItem>
              </>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      <Dialog open={loginOpen} onClose={handleLoginClose}>
        <DialogTitle>
          {isRegisterMode ? "Créer un compte" : "Connexion"}
        </DialogTitle>
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
                onChange={(e: any) => setRegFullName(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                value={regEmail}
                onChange={(e: any) => setRegEmail(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Téléphone"
                type="tel"
                fullWidth
                value={regPhone}
                onChange={(e: any) => setRegPhone(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Mot de passe"
                type="password"
                fullWidth
                value={regPassword}
                onChange={(e: any) => setRegPassword(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Confirmer le mot de passe"
                type="password"
                fullWidth
                value={regConfirm}
                onChange={(e: any) => setRegConfirm(e.target.value)}
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
                onChange={(e: any) => setUsername(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Mot de passe"
                type="password"
                fullWidth
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={adminMode}
                    onChange={(e: any) => setAdminMode(e.target.checked)}
                  />
                }
                label="Se connecter en tant qu'admin"
                sx={{ mt: 1 }}
              />
            </>
          )}
          {loginError ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {loginError}
            </Alert>
          ) : null}
          <Box sx={{ mt: 2 }}>
            {isRegisterMode ? (
              <Button
                variant="text"
                onClick={() => {
                  setIsRegisterMode(false);
                  setLoginError("");
                }}
              >
                Déjà un compte ? Se connecter
              </Button>
            ) : (
              <Button
                variant="text"
                onClick={() => {
                  setIsRegisterMode(true);
                  setAdminMode(false);
                  setLoginError("");
                }}
              >
                Créer un compte
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginClose}>Annuler</Button>
          {isRegisterMode ? (
            <Button
              onClick={handleRegister}
              variant="contained"
              color="primary"
            >
              S'inscrire
            </Button>
          ) : (
            <Button onClick={handleLogin} variant="contained" color="primary">
              Se connecter
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Nav;
