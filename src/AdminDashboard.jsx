import React, { useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider
} from '@mui/material';
import {
  AccountBalance,
  PeopleAlt,
  Savings,
  Assessment,
  Download
} from '@mui/icons-material';

export default function AdminDashboard({ deposits, users = [] }) {
  const stats = useMemo(() => {
    const totalInvested = (deposits || []).reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const totalDailyProfit = (deposits || []).reduce((sum, d) => sum + (Number(d.profit) || 0), 0);
    const totalDepositsCount = deposits?.length || 0;
    const totalUsers = users?.length || 0;
    const totalCommission = (users || []).reduce((sum, u) => sum + (Number(u.commissionBalance) || 0), 0);
    return { totalInvested, totalDailyProfit, totalDepositsCount, totalUsers, totalCommission };
  }, [deposits, users]);

  const formatCurrency = useMemo(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }), []);

  const exportAllDeposits = () => {
    const csvContent = [
      ['Date', 'Montant', 'Plan', 'Pourcentage', 'Profit Quotidien'],
      ...((deposits || []).map(dep => [
        dep.date,
        Number(dep.amount || 0).toFixed(2),
        dep.plan || '-',
        dep.percent != null ? `${dep.percent}%` : '-',
        Number(dep.profit || 0).toFixed(2)
      ]))
    ].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all-deposits.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Admin Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">Aperçu global et opérations</Typography>
        </Box>
        <Button variant="contained" startIcon={<Download />} onClick={exportAllDeposits}>Exporter dépôts</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PeopleAlt color="primary" />
                <Typography variant="subtitle2">Nombre d'utilisateurs</Typography>
              </Box>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>{stats.totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccountBalance color="success" />
                <Typography variant="subtitle2">Montant total investi</Typography>
              </Box>
              <Typography variant="h5" color="success.main" sx={{ fontWeight: 700 }}>{formatCurrency.format(stats.totalInvested)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Savings color="warning" />
                <Typography variant="subtitle2">Commission totale</Typography>
              </Box>
              <Typography variant="h5" color="warning.main" sx={{ fontWeight: 700 }}>{formatCurrency.format(stats.totalCommission)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Assessment color="secondary" />
                <Typography variant="subtitle2">Nombre de dépôts</Typography>
              </Box>
              <Typography variant="h5" color="secondary.main" sx={{ fontWeight: 700 }}>{stats.totalDepositsCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Tous les dépôts</Typography>
          <Chip label={`${deposits?.length || 0} enregistrements`} color="primary" variant="outlined" />
        </Box>
        <Divider sx={{ my: 2 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Montant</TableCell>
                <TableCell align="center">Plan</TableCell>
                <TableCell align="center">Pourcentage</TableCell>
                <TableCell align="right">Profit Quotidien</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(deposits && deposits.length > 0) ? (
                deposits.map((d, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{d.date}</TableCell>
                    <TableCell align="right">{formatCurrency.format(Number(d.amount || 0))}</TableCell>
                    <TableCell align="center">{d.plan || 'Standard'}</TableCell>
                    <TableCell align="center">{d.percent != null ? `${d.percent}%` : '-'}</TableCell>
                    <TableCell align="right">{formatCurrency.format(Number(d.profit || 0))}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary">Aucun dépôt pour l'instant.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}


