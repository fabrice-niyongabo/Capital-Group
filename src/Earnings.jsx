import React, { useState, useMemo } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Divider
} from '@mui/material';
import { 
  TrendingUp, 
  AccountBalance, 
  AttachMoney, 
  ShowChart,
  AccountBalanceWallet,
  Download,
  Info,
  CheckCircle,
  Warning,
  Timeline
} from '@mui/icons-material';
import './Earnings.css';

export default function Earnings({ deposits, dailyProfitPercent = 5, inviteLink, commissionBalance = 0, commissionHistory = [], onWithdrawCommission, referralCount = 0 }) {
  const formatCurrency = useMemo(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }), []);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!deposits || deposits.length === 0) {
      return {
        totalInvested: 0,
        totalDailyProfit: 0,
        totalProfit: 0,
        averageReturn: 0,
        activeInvestments: 0
      };
    }

    const totalInvested = deposits.reduce((sum, dep) => sum + dep.amount, 0);
    const totalDailyProfit = deposits.reduce((sum, dep) => sum + dep.profit, 0);
    const totalProfit = totalDailyProfit * 30; // Assuming 30 days
    const averageReturn = deposits.length > 0 ? 
      deposits.reduce((sum, dep) => sum + (dep.percent || dailyProfitPercent), 0) / deposits.length : 0;
    const activeInvestments = deposits.length;

    return {
      totalInvested,
      totalDailyProfit,
      totalProfit,
      averageReturn,
      activeInvestments
    };
  }, [deposits, dailyProfitPercent]);

  const handleWithdraw = () => {
    setWithdrawDialogOpen(true);
  };

  const handleWithdrawConfirm = async () => {
    setIsProcessing(true);
    try {
      // Simulate withdrawal processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Retrait de $${withdrawAmount} traité avec succès!`);
      setWithdrawDialogOpen(false);
      setWithdrawAmount('');
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['Date', 'Montant', 'Plan', 'Pourcentage', 'Profit Quotidien'],
      ...deposits.map(dep => [
        dep.date,
        dep.amount.toFixed(2),
        dep.plan || '-',
        dep.percent ? `${dep.percent}%` : '-',
        dep.profit.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'earnings-history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCopyInvite = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <Container maxWidth="lg" className="earnings-container">
      {/* Header Section */}
      <Box className="earnings-title">
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          sx={{ 
            color: 'white',
            backgroundColor: '#1976d2',
            padding: '8px 16px',
            borderRadius: '4px',
            display: 'inline-block',
            margin: '0 auto'
          }}
        >
          Tableau de Bord des Gains
        </Typography>
        <Typography 
          variant="subtitle1" 
          align="center" 
          sx={{ 
            color: 'white',
            backgroundColor: '#1976d2',
            padding: '6px 12px',
            borderRadius: '4px',
            display: 'inline-block',
            margin: '8px auto 0',
            fontSize: '1rem'
          }}
        >
          Suivez vos investissements et profits en temps réel
        </Typography>
      </Box>

      {/* Referral Section */}
      <Paper className="earnings-section" sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>Programme de Parrainage</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, alignItems: { xs: 'stretch', sm: 'center' } }}>
            <TextField
              label="Votre lien d'invitation"
              value={inviteLink || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <Button variant="contained" onClick={handleCopyInvite} disabled={!inviteLink}>
              {copied ? 'Copié!' : 'Copier'}
            </Button>
          </Box>
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card className="summary-card">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AttachMoney color="success" />
                    <Typography variant="h6">Commission disponible</Typography>
                  </Box>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency.format(commissionBalance || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    5% des dépôts de vos filleuls
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Plus vous invitez, plus vos commissions augmentent en temps réel.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Filleuls: <strong>{referralCount}</strong>
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        const amount = commissionBalance || 0;
                        if (!amount || amount <= 0) return;
                        if (onWithdrawCommission) {
                          const ok = onWithdrawCommission(amount);
                          if (ok) alert('Commission retirée avec succès.');
                        }
                      }}
                      disabled={!commissionBalance}
                    >
                      Retirer la commission
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Historique des Commissions</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Montant Dépôt</TableCell>
                      <TableCell align="right">Commission (5%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(commissionHistory && commissionHistory.length > 0) ? (
                      commissionHistory.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.date}</TableCell>
                          <TableCell align="right">{formatCurrency.format(c.amount)}</TableCell>
                          <TableCell align="right">{formatCurrency.format(c.commission)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography variant="body2" color="text.secondary">Aucune commission pour le moment.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2.4}>
          <Card className="summary-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccountBalance color="primary" />
                <Typography variant="h6">Investi Total</Typography>
              </Box>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                {formatCurrency.format(summaryStats.totalInvested)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {summaryStats.activeInvestments} investissement(s)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2.4}>
          <Card className="summary-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AttachMoney color="success" />
                <Typography variant="h6">Profit Quotidien</Typography>
              </Box>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {formatCurrency.format(summaryStats.totalDailyProfit)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Par jour
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2.4}>
          <Card className="summary-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUp color="warning" />
                <Typography variant="h6">Profit Total</Typography>
              </Box>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {formatCurrency.format(summaryStats.totalProfit)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                30 jours estimés
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2.4}>
          <Card className="summary-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ShowChart color="info" />
                <Typography variant="h6">Rendement Moyen</Typography>
              </Box>
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                {summaryStats.averageReturn.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Par jour
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2.4}>
          <Card className="summary-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Timeline color="secondary" />
                <Typography variant="h6">Performance</Typography>
              </Box>
              <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                {summaryStats.totalInvested > 0 ? 
                  ((summaryStats.totalDailyProfit / summaryStats.totalInvested) * 100).toFixed(1) : 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ROI quotidien
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AccountBalanceWallet />}
          onClick={handleWithdraw}
          disabled={summaryStats.totalDailyProfit === 0}
          className="action-button"
        >
          Retirer des Fonds
        </Button>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleExportData}
          disabled={!deposits || deposits.length === 0}
          className="action-button export-button"
          sx={{
            backgroundColor: '#2e7d32',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1b5e20',
            },
            '&:disabled': {
              backgroundColor: '#e0e0e0',
              color: '#9e9e9e',
            }
          }}
        >
          Exporter les Données
        </Button>
      </Box>

      {/* Profit Projection */}
      {summaryStats.totalInvested > 0 && (
        <Paper className="projection-section">
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShowChart color="primary" />
            Projections de Profit
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency.format(summaryStats.totalDailyProfit * 7)}
                </Typography>
                <Typography variant="body2" color="text.secondary">Cette semaine</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency.format(summaryStats.totalDailyProfit * 30)}
                </Typography>
                <Typography variant="body2" color="text.secondary">Ce mois</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h5" color="warning.main" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency.format(summaryStats.totalDailyProfit * 365)}
                </Typography>
                <Typography variant="body2" color="text.secondary">Cette année</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Deposits History Table */}
      <Paper className="earnings-section">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timeline color="primary" />
            Historique des Dépôts
          </Typography>
          <Chip 
            label={`${deposits?.length || 0} investissement(s)`} 
            color="primary" 
            variant="outlined"
          />
        </Box>
        <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
                <TableCell align="right">Montant</TableCell>
                <TableCell align="center">Plan</TableCell>
                <TableCell align="center">Pourcentage</TableCell>
                <TableCell align="right">Profit Quotidien</TableCell>
                <TableCell align="center">Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deposits && deposits.length > 0 ? (
              deposits.map((dep, idx) => (
                  <TableRow key={idx} hover>
                  <TableCell>{dep.date}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency.format(dep.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={'Normal'} 
                        size="small"
                        color={'success'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {dep.percent ? dep.percent + '%' : dailyProfitPercent + '%'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {formatCurrency.format(dep.profit)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        icon={<CheckCircle />}
                        label="Actif" 
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <AccountBalance sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Aucun investissement trouvé
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Commencez par faire votre premier investissement
                      </Typography>
                    </Box>
                  </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>

      {/* Withdrawal Dialog */}
      <Dialog open={withdrawDialogOpen} onClose={() => setWithdrawDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Retirer des Fonds</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Montant disponible pour retrait: <strong>{formatCurrency.format(summaryStats.totalDailyProfit)}</strong>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Montant à retirer"
            type="number"
            fullWidth
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            inputProps={{ max: summaryStats.totalDailyProfit }}
            sx={{ mt: 2 }}
          />
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Les retraits sont traités dans les 24 heures. 
              Vous ne pouvez retirer que vos profits quotidiens.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleWithdrawConfirm} 
            variant="contained"
            disabled={!withdrawAmount || parseFloat(withdrawAmount) > summaryStats.totalDailyProfit || isProcessing}
          >
            {isProcessing ? 'Traitement...' : 'Confirmer le Retrait'}
          </Button>
        </DialogActions>
        {isProcessing && <LinearProgress />}
      </Dialog>
    </Container>
  );
}
