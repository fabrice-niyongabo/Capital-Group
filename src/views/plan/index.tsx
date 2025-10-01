import { useEffect, useState } from "react";
import "./index.css";
import {
  Container,
  Typography,
  Paper,
  Box,
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
  LinearProgress,
} from "@mui/material";
import { TrendingUp, Security, Info, CheckCircle } from "@mui/icons-material";

import {
  currencyFormatter,
  errorHandler,
  setAuthHeaders,
  toastMessage,
} from "lib/util";
import axios from "axios";
import { IPlan } from "types/plan";
import { APP_CONFIG } from "lib/constants";
import FullPageLoader from "compoents/full-page-loader";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/reducers";
import { setShowLogin } from "store/actions/app";

export default function Plan({}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.userReducer);

  const [customAmount, setCustomAmount] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [depositPhoneNumber, setDepositPhoneNumber] = useState("");

  const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${APP_CONFIG.BACKEND_URL}/investment/plan`);
      setSelectedPlan(res.data[0]);
      setPlans(res.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateAmount = (amount: string) => {
    if (!selectedPlan) return "";
    const num = Number(amount);
    if (!amount) return "Veuillez entrer un montant";
    if (isNaN(num)) return "Montant invalide";
    if (num < Number(selectedPlan.minimum_amount))
      return `Montant minimum: $${currencyFormatter(
        selectedPlan.minimum_amount
      )}`;
    if (num > Number(selectedPlan.maximum_amount))
      return `Montant maximum: $${currencyFormatter(
        selectedPlan.maximum_amount
      )}`;
    return "";
  };

  const calculateDailyProfit = (amount: number) => {
    if (!selectedPlan) return 0;
    return (amount * selectedPlan.daily_percentage) / 100;
  };

  const calculateTotalProfit = (amount: number) => {
    const dailyProfit = calculateDailyProfit(amount);
    const duration = 30;
    return dailyProfit * duration;
  };

  const handleAmountChange = (e: any) => {
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
    if (depositPhoneNumber.trim() === "") {
      toastMessage("ERROR", "Veuillez entrer un numéro de téléphone valide");
      return;
    }

    setConfirmDialogOpen(true);
  };

  const handleConfirmInvestment = async () => {
    if (!token) {
      toastMessage(
        "ERROR",
        "Vous devez vous connecter pour commencer à investir"
      );
      setConfirmDialogOpen(false);
      dispatch(setShowLogin(true));
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${APP_CONFIG.BACKEND_URL}/investment/initiate`,
        {
          planId: selectedPlan?.id,
          amount: Number(customAmount),
          deposit_phone_number: depositPhoneNumber,
        },
        setAuthHeaders(token)
      );
      toastMessage(
        "SUCCESS",
        "Demande d'investissement initiée. Veuillez soumettre une preuve de paiement pour confirmation."
      );
      setConfirmDialogOpen(false);
      navigate("/earnings");
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

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
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={plans[0]?.name}
                      color={"success"}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell align="center">{plans[0]?.minimum_amount}</TableCell>
                <TableCell align="center">
                  <Typography
                    variant="body2"
                    sx={{ color: "blue", fontWeight: "bold" }}
                  >
                    {plans[0]?.daily_percentage}%
                  </Typography>
                </TableCell>
                <TableCell align="center">30 jours</TableCell>
                <TableCell align="center">
                  <Tooltip title={plans[0]?.description}>
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
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Security color="primary" />
              Configuration de l'Investissement
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" className="plan-amount-label">
                Plan sélectionné:{" "}
                <Chip label={selectedPlan?.name} color="primary" />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Montant:{" "}
                {`$${currencyFormatter(
                  selectedPlan?.minimum_amount
                )} - $${currencyFormatter(selectedPlan?.maximum_amount)}`}
              </Typography>
            </Box>

            <TextField
              type="number"
              label={`Entrez le montant (min $${currencyFormatter(
                selectedPlan?.minimum_amount
              )}${
                selectedPlan?.maximum_amount
                  ? `, max $${currencyFormatter(selectedPlan?.maximum_amount)}`
                  : ""
              })`}
              value={customAmount}
              onChange={handleAmountChange}
              fullWidth
              error={!!validationError}
              helperText={validationError}
              inputProps={{
                min: selectedPlan?.minimum_amount,
                max: selectedPlan?.maximum_amount || undefined,
              }}
              sx={{ mb: 2 }}
            />

            {customAmount && !validationError && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Projection de profit:</strong>
                  <br />• Profit quotidien: $
                  {calculateDailyProfit(Number(customAmount)).toFixed(2)}
                  <br />• Profit total 30 jours: $
                  {calculateTotalProfit(Number(customAmount)).toFixed(2)}
                </Typography>
              </Alert>
            )}

            <div>
              <p>
                Saisissez le numéro de téléphone que vous utiliserez pour
                déposer votre investissement.
              </p>
              <p className="font-bold text-sm">
                NB: Vous devez payer avec ce numéro de téléphone, sinon nous ne
                pourrons pas créditer votre compte.
              </p>
              <TextField
                type="text"
                label="Numéro de téléphone du dépôt"
                value={depositPhoneNumber}
                onChange={(e) => setDepositPhoneNumber(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              className="plan-submit-btn"
              onClick={handleSubmit}
              disabled={!customAmount || !!validationError || isSubmitting}
              fullWidth
              size="large"
            >
              {isSubmitting ? "Traitement..." : "Confirmer l'Investissement"}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="plan-features-card">
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CheckCircle color="success" />
                Fonctionnalités {selectedPlan?.name}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {plans.map((feature, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body2">{feature?.name}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Conseils:</strong> Investissez régulièrement pour faire
              croître votre capital et recevez vos profits chaque jour. Utilisez
              la page Plan pour confirmer vos dépôts, suivez vos gains dans
              l’onglet Gains et partagez votre lien d’invitation pour gagner des
              commissions.
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmer l'Investissement</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Êtes-vous sûr de vouloir investir <strong>${customAmount}</strong>{" "}
            dans le plan <strong>{selectedPlan?.name}</strong>?
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>Détails de l'investissement:</strong>
              <br />• Montant: ${customAmount}
              <br />• Plan: {selectedPlan?.name}
              <br />• Profit quotidien: {selectedPlan?.daily_percentage}% ($
              {calculateDailyProfit(Number(customAmount)).toFixed(2)})<br />•
              Durée: 30 jours
              <br />• Profit total estimé: $
              {calculateTotalProfit(Number(customAmount)).toFixed(2)}
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
            {isSubmitting ? "Traitement..." : "Confirmer"}
          </Button>
        </DialogActions>
        {isSubmitting && <LinearProgress />}
        <FullPageLoader open={isLoading} />
      </Dialog>
      <FullPageLoader open={isLoading && !confirmDialogOpen} />
    </Container>
  );
}
