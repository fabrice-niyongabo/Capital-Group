import { useState, useMemo } from "react";
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
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  AttachMoney,
  ShowChart,
  AccountBalanceWallet,
} from "@mui/icons-material";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/reducers";
import { APP_CONFIG } from "lib/constants";
import InvestmentHistory from "./InvestmentHistory";
import Summary from "./Summary";
import {
  currencyFormatter,
  errorHandler,
  setAuthHeaders,
  toastMessage,
} from "lib/util";
import FullPageLoader from "compoents/full-page-loader";
import axios from "axios";
import WithdrawHistory from "./WithdrawHistory";
import Commisions from "./Commisions";

export default function Earnings() {
  const { statistics } = useSelector(
    (state: RootState) => state.statisticsReducer
  );
  const { token, userDetails } = useSelector(
    (state: RootState) => state.userReducer
  );

  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawalPhoneNumber, setWithdrawalPhoneNumber] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdrawConfirm = async () => {
    try {
      if (!statistics) return;

      if (
        !withdrawAmount ||
        parseFloat(withdrawAmount) > (statistics?.wallet_total_amount || 0)
      ) {
        toastMessage(
          "ERROR",
          "Vous ne pouvez pas retirer plus que ce que vous avez."
        );
        return;
      }

      if (withdrawalPhoneNumber.trim() === "") {
        toastMessage("ERROR", "Veuillez entrer un numéro de téléphone.");
        return;
      }

      setIsWithdrawing(true);
      await axios.post(
        `${APP_CONFIG.BACKEND_URL}/wallet/withdraw`,
        {
          amount: withdrawAmount,
          withdrawal_phone_number: withdrawalPhoneNumber,
        },
        setAuthHeaders(token || "")
      );
      toastMessage("SUCCESS", "Demande de retrait initiée avec succès!");
      setWithdrawDialogOpen(false);
      setWithdrawAmount("");
      window.location.reload();
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsWithdrawing(false);
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
            color: "white",
            backgroundColor: "#1976d2",
            padding: "8px 16px",
            borderRadius: "4px",
            display: "inline-block",
            margin: "0 auto",
          }}
        >
          Tableau de Bord des Gains
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            color: "white",
            backgroundColor: "#1976d2",
            padding: "6px 12px",
            borderRadius: "4px",
            display: "inline-block",
            margin: "8px auto 0",
            fontSize: "1rem",
          }}
        >
          Suivez vos investissements et profits en temps réel
        </Typography>
      </Box>

      <Commisions />

      <Summary />

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, justifyContent: "center" }}>
        <Button
          variant="contained"
          startIcon={<AccountBalanceWallet />}
          onClick={() => setWithdrawDialogOpen(true)}
          // disabled={statistics?.wallet_total_amount === 0}
          className="action-button"
        >
          Retirer des Fonds
        </Button>
      </Box>

      <InvestmentHistory />
      <WithdrawHistory />

      {/* Withdrawal Dialog */}
      <Dialog
        open={withdrawDialogOpen}
        onClose={() => setWithdrawDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Retirer des Fonds</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Montant disponible pour retrait:{" "}
            <strong>
              {currencyFormatter(statistics?.wallet_total_amount || 0)}$
            </strong>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Montant à retirer"
            type="number"
            fullWidth
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            // inputProps={{ max: statistics?.wallet_total_amount || 0 }}
            sx={{ mt: 2 }}
          />
          <Typography
            variant="body1"
            gutterBottom
            sx={{ mt: 2, fontWeight: 600 }}
          >
            Entrez un numéro de téléphone où nous enverrons votre argent.
            Example: 098..........
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Numéro de téléphone de retrait"
            type="number"
            fullWidth
            value={withdrawalPhoneNumber}
            onChange={(e) => setWithdrawalPhoneNumber(e.target.value)}
          />
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Les retraits sont traités dans les 24 heures. Vous ne pouvez
              retirer que vos profits quotidiens.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleWithdrawConfirm}
            variant="contained"
            // disabled={
            //   !withdrawAmount ||
            //   parseFloat(withdrawAmount) > summaryStats.totalDailyProfit
            // }
          >
            Confirmer le Retrait
          </Button>
        </DialogActions>
        <FullPageLoader open={isWithdrawing} />
      </Dialog>
    </Container>
  );
}
