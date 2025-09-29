import {
  AccountBalance,
  CheckCircle,
  Info,
  Timeline,
  Warning,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { APP_CONFIG } from "lib/constants";
import { currencyFormatter, errorHandler, setAuthHeaders } from "lib/util";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers";
import { IWithdrawalResponse } from "types/withDrawals";

function WithdrawHistory() {
  const { token } = useSelector((state: RootState) => state.userReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawalResponse, setWithdrawalResponse] = useState<
    IWithdrawalResponse | undefined
  >(undefined);

  const fetchWithdrawals = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${APP_CONFIG.BACKEND_URL}/wallet/withdraw?limit=100&page=1`,
        setAuthHeaders(token || "")
      );
      setWithdrawalResponse(res.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);
  return (
    <Paper className="earnings-section">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Timeline color="primary" />
            Historique des retraits
          </Typography>
          {isLoading && <CircularProgress color="primary" size={25} />}
        </Stack>
        <Chip
          label={`${withdrawalResponse?.items?.length || 0} retrait(s)`}
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
              <TableCell align="center">
                Numéro de téléphone de retrait
              </TableCell>
              <TableCell align="center">Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {withdrawalResponse?.items &&
            withdrawalResponse.items.length > 0 ? (
              withdrawalResponse.items.map((w, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>
                    {new Date(w.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      ${currencyFormatter(w.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={w.withdrawal_phone_number}
                      size="small"
                      color={"success"}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {w.status === "SUCCESS" && (
                      <Chip
                        icon={<CheckCircle />}
                        label="Actif"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                    {w.status === "FAILED" && (
                      <Chip
                        icon={<Warning />}
                        label="Echoué"
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )}
                    {w.status === "PENDING" && (
                      <Chip
                        icon={<Info />}
                        label="En attente"
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <AccountBalance
                      sx={{ fontSize: 48, color: "grey.400", mb: 2 }}
                    />
                    <Typography variant="h6" color="text.secondary">
                      Aucune donnée trouvée
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default WithdrawHistory;
