import React, { useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Divider
} from '@mui/material';
import {
  AccountBalance,
  AttachMoney,
  TrendingUp,
  Timeline,
  AddCircleOutline,
  Assessment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ deposits, dailyProfitPercent = 5 }) {
  const navigate = useNavigate();

  const summary = useMemo(() => {
    if (!deposits || deposits.length === 0) {
      return {
        totalInvested: 0,
        totalDailyProfit: 0,
        avgPercent: 0,
        activeInvestments: 0
      };
    }
    const totalInvested = deposits.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const totalDailyProfit = deposits.reduce((sum, d) => sum + (Number(d.profit) || 0), 0);
    const avgPercent = deposits.reduce((sum, d) => sum + (d.percent || dailyProfitPercent), 0) / deposits.length;
    return {
      totalInvested,
      totalDailyProfit,
      avgPercent,
      activeInvestments: deposits.length
    };
  }, [deposits, dailyProfitPercent]);

  const formatCurrency = useMemo(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }), []);

  const recentDeposits = useMemo(() => (deposits || []).slice(-5).reverse(), [deposits]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Tableau de bord</Typography>
          <Typography variant="body2" color="text.secondary">Vue d'ensemble de vos investissements</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<AddCircleOutline />} onClick={() => navigate('/plan')}>
            Nouvel investissement
          </Button>
          <Button variant="outlined" startIcon={<Assessment />} onClick={() => navigate('/earnings')}>
            Voir les gains
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccountBalance color="primary" />
                <Typography variant="subtitle2">Total investi</Typography>
              </Box>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                {formatCurrency.format(summary.totalInvested)}
              </Typography>
              <Typography variant="caption" color="text.secondary">{summary.activeInvestments} actif(s)</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AttachMoney color="success" />
                <Typography variant="subtitle2">Profit quotidien</Typography>
              </Box>
              <Typography variant="h5" color="success.main" sx={{ fontWeight: 700 }}>
                {formatCurrency.format(summary.totalDailyProfit)}
              </Typography>
              <Typography variant="caption" color="text.secondary">Aujourd'hui</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUp color="warning" />
                <Typography variant="subtitle2">Profit 30 jours (estimé)</Typography>
              </Box>
              <Typography variant="h5" color="warning.main" sx={{ fontWeight: 700 }}>
                {formatCurrency.format(summary.totalDailyProfit * 30)}
              </Typography>
              <Typography variant="caption" color="text.secondary">Basé sur le taux actuel</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Timeline color="secondary" />
                <Typography variant="subtitle2">Rendement moyen</Typography>
              </Box>
              <Typography variant="h5" color="secondary.main" sx={{ fontWeight: 700 }}>
                {summary.avgPercent.toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">Par jour</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Derniers investissements</Typography>
              <Divider sx={{ mb: 2 }} />
              {recentDeposits.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Aucun investissement pour le moment.</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {recentDeposits.map((d, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={d.plan || 'Standard'} size="small" color={d.plan === 'VIP' ? 'warning' : d.plan === 'VVIP' ? 'secondary' : 'success'} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency.format(d.amount)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary">{d.date}</Typography>
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>{(d.percent || dailyProfitPercent)}%</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Raccourcis</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="contained" onClick={() => navigate('/plan')}>Faire un dépôt</Button>
                <Button variant="outlined" onClick={() => navigate('/earnings')}>Historique des gains</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}


