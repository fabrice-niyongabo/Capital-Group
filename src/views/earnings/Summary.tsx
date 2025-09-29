import {
  AccountBalance,
  AttachMoney,
  ShowChart,
  Timeline,
  TrendingUp,
} from "@mui/icons-material";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import axios from "axios";
import { stat } from "fs";
import { APP_CONFIG } from "lib/constants";
import { currencyFormatter, errorHandler, setAuthHeaders } from "lib/util";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers";

interface IStatistics {
  active_investments?: number;
  total_amount_invested?: number;
  total_amount_earned?: number;
  wallet_total_amount?: number;
  wallet_total_withdrawals?: number;
}
function Summary() {
  const { token } = useSelector((state: RootState) => state.userReducer);
  const [statistics, setStatistics] = useState<IStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${APP_CONFIG.BACKEND_URL}/user/stats`,
        setAuthHeaders(token || "")
      );
      setStatistics(res.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
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
              {statistics?.total_amount_invested || 0}
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
              <AttachMoney color="success" />
              <Typography variant="h6">Profit Quotidien</Typography>
            </Box>
            <Typography
              variant="h4"
              color="success.main"
              sx={{ fontWeight: "bold" }}
            >
              {currencyFormatter(statistics?.total_amount_earned || 0)}$
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Totale
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
              {currencyFormatter(statistics?.total_amount_earned || 0)}$
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <ShowChart color="info" />
              <Typography variant="h6">Rendement Moyen</Typography>
            </Box>
            <Typography
              variant="h4"
              color="info.main"
              sx={{ fontWeight: "bold" }}
            >
              {0}%
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Timeline color="secondary" />
              <Typography variant="h6">Performance</Typography>
            </Box>
            <Typography
              variant="h4"
              color="secondary.main"
              sx={{ fontWeight: "bold" }}
            >
              {/* {summaryStats.totalInvested > 0
                ? (
                    (summaryStats.totalDailyProfit /
                      summaryStats.totalInvested) *
                    100
                  ).toFixed(1)
                : 0} */}
              %
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ROI quotidien
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Summary;
