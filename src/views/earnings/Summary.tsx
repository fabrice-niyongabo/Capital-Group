import {
  AccountBalance,
  ShowChart,
  Timeline,
  TrendingUp,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { currencyFormatter } from "lib/util";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatistics } from "store/actions/walletStatistics";
import { RootState } from "store/reducers";

function Summary() {
  const dispatch = useDispatch();
  const { isLoading, statistics } = useSelector(
    (state: RootState) => state.statisticsReducer
  );

  useEffect(() => {
    dispatch(fetchStatistics());
  }, []);

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} sm={4} md={2.4}>
        <Card className="summary-card">
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <AccountBalance color="primary" />
              <Typography variant="h6">Investi Total</Typography>
            </Box>
            <Typography
              variant="h4"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              {isLoading ? (
                <CircularProgress size={20} />
              ) : (
                statistics?.total_amount_invested || 0
              )}
              $
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {statistics?.active_investments || 0} investissement(s)
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={6} sm={4} md={2.4}>
        <Card className="summary-card">
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <TrendingUp color="warning" />
              <Typography variant="h6">Profit Total</Typography>
            </Box>
            <Typography
              variant="h4"
              color="warning.main"
              sx={{ fontWeight: "bold" }}
            >
              {isLoading ? (
                <CircularProgress size={20} />
              ) : (
                currencyFormatter(statistics?.total_amount_earned || 0)
              )}
              $
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={6} sm={4} md={2.4}>
        <Card className="summary-card">
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <ShowChart color="secondary" />
              <Typography variant="h6">Montant retiré</Typography>
            </Box>
            <Typography
              variant="h4"
              color="secondary.main"
              sx={{ fontWeight: "bold" }}
            >
              {isLoading ? (
                <CircularProgress size={20} />
              ) : (
                currencyFormatter(statistics?.wallet_total_withdrawals || 0)
              )}
              $
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={6} sm={4} md={2.4}>
        <Card className="summary-card">
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Timeline color="info" />
              <Typography variant="h6">Mon solde</Typography>
            </Box>
            <Typography
              variant="h4"
              color="info.main"
              sx={{ fontWeight: "bold" }}
            >
              {isLoading ? (
                <CircularProgress size={20} />
              ) : (
                currencyFormatter(statistics?.wallet_total_amount || 0)
              )}
              $
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Solde de retrait
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Summary;
