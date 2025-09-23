import React, { useState } from 'react';
import './Plan.css';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Button, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import { 
  TrendingUp, 
  Security, 
  Schedule, 
  Info,
  CheckCircle,
  Warning
} from '@mui/icons-material';

const plans = [
  { 
    name: 'Normal', 
    range: '10$ - 999$', 
    min: 10, 
    max: 999, 
    percent: 5,
    duration: '30 jours',
    features: ['Support 24/7', 'Retrait quotidien', 'Garantie de sécurité'],
    color: '#4caf50'
  }
];

import { useNavigate } from 'react-router-dom';

export default function Plan({ deposit, setDeposit, deposits, handleDeposit }) {
  const [selectedPlan, setSelectedPlan] = useState('Normal');
  const [customAmount, setCustomAmount] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
    setCustomAmount('');
    setValidationError('');
  };

  const plan = plans.find(p => p.name === selectedPlan);

  const validateAmount = (amount) => {
    const num = Number(amount);
    if (!amount) return 'Veuillez entrer un montant';
    if (isNaN(num)) return 'Montant invalide';
    if (num < plan.min) return `Montant minimum: $${plan.min}`;
    if (plan.max && num > plan.max) return `Montant maximum: $${plan.max}`;
    return '';
  };

  const calculateDailyProfit = (amount) => {
    return (amount * plan.percent) / 100;
  };

  const calculateTotalProfit = (amount) => {
    const dailyProfit = calculateDailyProfit(amount);
    const duration = parseInt(plan.duration);
    return dailyProfit * duration;
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    setValidationError(validateAmount(val));
  };

  const handleSubmit = () => {
    const error = validateAmount(customAmount);
    if (error) {
      setValidationError(error);
      return;
    }
    setConfirmDialogOpen(true);
  };

  const handleConfirmInvestment = async () => {
    setIsSubmitting(true);
    try {
      if (typeof handleDeposit === 'function' && customAmount) {
        await handleDeposit({
          amount: Number(customAmount),
          plan: selectedPlan,
          percent: plan.percent
        });
        setConfirmDialogOpen(false);
        navigate('/earnings');
      }
    } catch (error) {
      console.error('Investment failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" className="plan-container">
      {/* Header Section */}
      <Box className="plan-title">
        <Typography variant="h4" align="center" gutterBottom>
          Plans d'Investissement
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          Choisissez le plan qui correspond à vos objectifs financiers
        </Typography>
      </Box>

      {/* Plan Comparison Table */}
      <Paper className="plan-comparison-section">
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp color="primary" />
          Comparaison des Plans
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Plan</TableCell>
                <TableCell align="center">Montant</TableCell>
                <TableCell align="center">Profit Quotidien</TableCell>
                <TableCell align="center">Durée</TableCell>
                <TableCell align="center">Fonctionnalités</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow selected>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={plans[0].name} 
                      color={'success'}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell align="center">{plans[0].range}</TableCell>
                <TableCell align="center">
                  <Typography variant="body2" sx={{ color: plans[0].color, fontWeight: 'bold' }}>
                    {plans[0].percent}%
                  </Typography>
                </TableCell>
                <TableCell align="center">{plans[0].duration}</TableCell>
                <TableCell align="center">
                  <Tooltip title={plans[0].features.join(', ')}>
                    <IconButton size="small">
                      <Info />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Investment Form */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper className="plan-section">
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Security color="primary" />
              Configuration de l'Investissement
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" className="plan-amount-label">
                Plan sélectionné: <Chip label="Normal" color="primary" />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Montant ({plan.range}):
              </Typography>
            </Box>

            <TextField
              type="number"
              label={`Entrez le montant (min $${plan.min}${plan.max ? `, max $${plan.max}` : ''})`}
              value={customAmount}
              onChange={handleAmountChange}
              fullWidth
              error={!!validationError}
              helperText={validationError}
              inputProps={{ min: plan.min, max: plan.max || undefined }}
              sx={{ mb: 2 }}
            />

            {customAmount && !validationError && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Projection de profit:</strong><br/>
                  • Profit quotidien: ${calculateDailyProfit(Number(customAmount)).toFixed(2)}<br/>
                  • Profit total ({plan.duration}): ${calculateTotalProfit(Number(customAmount)).toFixed(2)}
                </Typography>
              </Alert>
            )}

            <Button
              variant="contained"
              color="primary"
              className="plan-submit-btn"
              onClick={handleSubmit}
              disabled={!customAmount || !!validationError || isSubmitting}
              fullWidth
              size="large"
            >
              {isSubmitting ? 'Traitement...' : 'Confirmer l\'Investissement'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="plan-features-card">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="success" />
                Fonctionnalités {selectedPlan}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {plan.features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body2">{feature}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Conseils:</strong> Investissez régulièrement pour faire croître votre capital et recevez vos profits chaque jour.
              Utilisez la page Plan pour confirmer vos dépôts, suivez vos gains dans l’onglet Gains et partagez votre lien d’invitation pour gagner des commissions.
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmer l'Investissement</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Êtes-vous sûr de vouloir investir <strong>${customAmount}</strong> dans le plan <strong>{selectedPlan}</strong>?
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>Détails de l'investissement:</strong><br/>
              • Montant: ${customAmount}<br/>
              • Plan: {selectedPlan}<br/>
              • Profit quotidien: {plan.percent}% (${calculateDailyProfit(Number(customAmount)).toFixed(2)})<br/>
              • Durée: {plan.duration}<br/>
              • Profit total estimé: ${calculateTotalProfit(Number(customAmount)).toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleConfirmInvestment} 
            variant="contained" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Traitement...' : 'Confirmer'}
          </Button>
        </DialogActions>
        {isSubmitting && <LinearProgress />}
      </Dialog>
    </Container>
  );
}
