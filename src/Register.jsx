import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  TextField,
  Typography,
  Button,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Register({ onRegister }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setError('');
    setSuccess('');
  }, [fullName, email, password, confirmPassword]);

  const validate = () => {
    if (!fullName.trim()) return 'Veuillez entrer votre nom complet';
    if (!email.trim()) return 'Veuillez entrer votre email';
    const emailRe = /.+@.+\..+/;
    if (!emailRe.test(email)) return 'Adresse email invalide';
    if (!password) return 'Veuillez entrer un mot de passe';
    if (password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères';
    if (password !== confirmPassword) return 'Les mots de passe ne correspondent pas';
    return '';
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    try {
      const ok = await onRegister?.({ fullName: fullName.trim(), email: email.trim().toLowerCase(), password });
      if (ok === false) {
        setError("Un utilisateur avec cet email existe déjà");
        return;
      }
      setSuccess('Compte créé avec succès. Vous pouvez maintenant vous connecter.');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (e) {
      setError("Échec de l'inscription. Réessayez.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Créer un compte</Typography>
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
        {success ? <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert> : null}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nom complet" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <TextField label="Confirmer le mot de passe" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth />
          <Button variant="contained" onClick={handleSubmit} size="large">S'inscrire</Button>
          <Button variant="text" onClick={() => navigate('/dashboard')}>Annuler</Button>
        </Box>
      </Paper>
    </Container>
  );
}


