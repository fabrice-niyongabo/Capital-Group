import {
  AccountBalance,
  CheckCircle,
  Info,
  Timeline,
  Warning,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import FullPageLoader from "compoents/full-page-loader";
import { APP_CONFIG } from "lib/constants";
import {
  currencyFormatter,
  errorHandler,
  setAuthHeaders,
  toastMessage,
} from "lib/util";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers";
import { IInvestment, IInvestmentResponse } from "types/investments";

function InvestmentHistory() {
  const { token } = useSelector((state: RootState) => state.userReducer);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [investments, setInvestments] = useState<
    IInvestmentResponse | undefined
  >(undefined);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IInvestment | null>(null);
  const [proofImage, setProofImage] = useState<any>(null);

  const proofImageRef = useRef<any>(null);

  const fetchInvestments = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${APP_CONFIG.BACKEND_URL}/investment?page=1&limit=100`,
        setAuthHeaders(token || "")
      );
      setInvestments(res.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedItem || !proofImage) {
        toastMessage(
          "ERROR",
          "Veuillez sélectionner un investissement et une preuve de paiement."
        );
        return;
      }
      const formData = new FormData();
      formData.append("file", proofImage);
      setIsSubmitting(true);
      await axios.put(
        APP_CONFIG.BACKEND_URL +
          "/investment/payment/proof/" +
          selectedItem?.id,
        formData,
        setAuthHeaders(token || "")
      );
      toastMessage(
        "SUCCESS",
        `La preuve de paiement a été envoyée avec succès.`
      );
      if (proofImageRef?.current) {
        proofImageRef.current.value = "";
      }
      setShowDialog(false);
      fetchInvestments();
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
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
            Historique des Dépôts
          </Typography>
          {isLoading && <CircularProgress color="primary" size={25} />}
        </Stack>
        <Chip
          label={`${investments?.items?.length || 0} investissement(s)`}
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
              <TableCell align="center">Date de fin</TableCell>
              <TableCell align="center">Preuve</TableCell>
              <TableCell align="center">Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {investments?.items && investments.items.length > 0 ? (
              investments.items.map((inv, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>
                    {new Date(inv.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      ${currencyFormatter(inv.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={inv.plan.name}
                      size="small"
                      color={"success"}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "success.main" }}
                    >
                      {inv.plan.daily_percentage + "%"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "success.main" }}
                    >
                      {currencyFormatter(
                        (inv.amount * inv.plan.daily_percentage) / 100
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {inv.earning_end_date
                      ? new Date(inv.earning_end_date).toLocaleDateString()
                      : "N/A"}
                  </TableCell>

                  <TableCell align="center">
                    {inv.payment_proof ? (
                      <a
                        href={APP_CONFIG.FILE_URL + inv.payment_proof}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {inv.payment_status === "SUCCESS" && (
                      <Chip
                        icon={<CheckCircle />}
                        label="Actif"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                    {inv.payment_status === "FAILED" && (
                      <Chip
                        icon={<Warning />}
                        label="Echoué"
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )}
                    {inv.payment_status === "PENDING" && (
                      <>
                        <Chip
                          icon={<Info />}
                          label="En attente"
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                        {!inv.payment_proof && (
                          <Button
                            onClick={() => {
                              setSelectedItem(inv);
                              setShowDialog(true);
                            }}
                            variant="contained"
                            color="primary"
                            sx={{ fontSize: 12, textTransform: "none" }}
                          >
                            Payer
                          </Button>
                        )}
                      </>
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

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmer l'Investissement</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            <strong>Deposit Instructions</strong>
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <ol type="1">
              <li>
                Assurez-vous de payer en utilisant ce numéro de téléphone{" "}
                <strong>{selectedItem?.deposit_phone_number}</strong>
              </li>
              <li>
                Déposez {selectedItem?.amount}$ sur ce numéro de téléphone:
                <strong>{selectedItem?.agent_phone.phone}</strong>
              </li>
              <li>
                Prenez une capture d'écran du message de confirmation du
                transfert d'argent.
                <a href="tel:*501#">
                  <Button fullWidth variant="contained">
                    Payez maintenant
                  </Button>
                </a>
              </li>
              <li>
                Téléchargez la capture d'écran ci-dessous et attendez que
                l'administrateur confirme votre dépôt et commence à gagner !
              </li>
            </ol>
            <br />
            <Typography variant="body1">
              Preuve de paiement image/capture d'écran (jpg, png)
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Preuve de paiement"
              type="file"
              fullWidth
              onChange={(e: any) => setProofImage(e.target.files[0])}
              required
              disabled={isSubmitting}
              ref={proofImageRef}
            />

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                L'approbation du dépôt prend au maximum deux heures. Veuillez
                patienter.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Annuler</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting}
          >
            Soumettre une preuve de paiement
          </Button>
        </DialogActions>
        <FullPageLoader open={isSubmitting} />
      </Dialog>
    </Paper>
  );
}

export default InvestmentHistory;
