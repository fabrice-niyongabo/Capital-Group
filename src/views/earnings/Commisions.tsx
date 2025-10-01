import { AttachMoney } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  LinearProgress,
  Paper,
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
import MaskedEmail from "compoents/MaskedEmail";
import { APP_CONFIG } from "lib/constants";
import { currencyFormatter, errorHandler, setAuthHeaders } from "lib/util";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers";

interface ICommission {
  id: number;
  amount: string;
  approval_comment?: string;
  commision_user_email: string;
  created_at: string;
  status: string;
  transaction_type: string;
  updated_at: string;
  userId: number;
  withdrawal_phone_number?: string;
}

function Commisions() {
  const { userDetails, token } = useSelector(
    (state: RootState) => state.userReducer
  );

  const [commissions, setCommissions] = useState<ICommission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteLink =
    APP_CONFIG.PUBLIC_URL + "/invite?referalCode=" + userDetails?.referalCode;

  const handleCopyInvite = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const fetchCommissions = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${APP_CONFIG.BACKEND_URL}/wallet/commisions`,
        setAuthHeaders(token || "")
      );
      setCommissions(res.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);
  return (
    <Paper className="earnings-section" sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Programme de Parrainage
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <TextField
            disabled
            label="Votre lien d'invitation"
            value={inviteLink || ""}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <Button
            variant="contained"
            onClick={handleCopyInvite}
            disabled={!inviteLink}
          >
            {copied ? "Copié!" : "Copier"}
          </Button>
        </Box>
        <Divider />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card className="summary-card">
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <AttachMoney color="success" />
                  <Typography variant="h6">Commission disponible</Typography>
                </Box>
                <Typography
                  variant="h4"
                  color="success.main"
                  sx={{ fontWeight: "bold" }}
                >
                  {currencyFormatter(
                    commissions.reduce((sum, c) => sum + Number(c.amount), 0) ||
                      0
                  )}
                  $
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  5% des dépôts de vos filleuls
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Plus vous invitez, plus vos commissions augmentent en temps
                  réel.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Filleuls: <strong>{commissions.length}</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Historique des Commissions
              {isLoading && <LinearProgress />}
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Referral</TableCell>
                    <TableCell align="right">Commission (5%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commissions.length > 0 ? (
                    commissions.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          {new Date(c.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <MaskedEmail email={c.commision_user_email} />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "bold", color: "green" }}
                        >
                          +{currencyFormatter(c.amount)}$
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="body2" color="text.secondary">
                          Aucune commission pour le moment.
                        </Typography>
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
  );
}

export default Commisions;
