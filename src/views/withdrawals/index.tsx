import {
  AccountBalance,
  CheckCircle,
  Info,
  Warning,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers";
import { IWithdrawal, IWithdrawalResponse } from "types/withDrawals";

interface IAgentPhone {
  id: number;
  balance: number;
  created_at: string;
  isdeleted: boolean;
  name: string;
  phone: string;
  updated_at: string;
}
function WithDrawals() {
  const { token } = useSelector((state: RootState) => state.userReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawalResponse, setWithdrawalResponse] = useState<
    IWithdrawalResponse | undefined
  >(undefined);

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<
    IWithdrawal | undefined
  >(undefined);
  const [approvalComment, setApprovalComment] = useState("");
  const [agentPhoneNumber, setAgentPhoneNumber] = useState("");

  const [phoneNumbers, setPhoneNumbers] = useState<IAgentPhone[]>([]);
  const [isLoadingPhoneNumbers, setIsLoadingPhoneNumbers] = useState(false);

  const fetchPhoneNumbers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${APP_CONFIG.BACKEND_URL}/agent/phone`,
        setAuthHeaders(token || "")
      );
      setPhoneNumbers(res.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${APP_CONFIG.BACKEND_URL}/wallet/transactions/all?limit=100&page=1`,
        setAuthHeaders(token || "")
      );
      setWithdrawalResponse(res.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      if (!selectedWithdrawal) return;
      setIsLoading(true);
      setApproveDialogOpen(false);
      const res = await axios.put(
        `${APP_CONFIG.BACKEND_URL}/wallet/withdraw/approve/${selectedWithdrawal.id}`,
        {
          amount: Number(selectedWithdrawal?.amount || 0),
          approval_comment: approvalComment,
          agent_withdrawal_phone_number: agentPhoneNumber,
        },
        setAuthHeaders(token || "")
      );
      setAgentPhoneNumber("");
      setApprovalComment("");
      toastMessage("SUCCESS", res.data.message);
      fetchWithdrawals();
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
    fetchPhoneNumbers();
  }, []);

  return (
    <Container maxWidth="md" className="home-container">
      <Paper className="plan-comparison-section">
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 600,
          }}
        >
          User Withdrawals
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Withrawal phone number</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {withdrawalResponse?.items &&
              withdrawalResponse.items.length > 0 ? (
                withdrawalResponse.items
                  .filter((item) => item.status === "PENDING")
                  .map((w, idx) => (
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
                            label="Pending"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedWithdrawal(w);
                            setApproveDialogOpen(true);
                          }}
                        >
                          Approve
                        </Button>

                        {/* <Button
                          variant="outlined"
                          size="small"
                          color="secondary"
                        >
                          Reject
                        </Button> */}
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
                        No Data found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            You are about to approve the withdrawal of{" "}
            <strong>${selectedWithdrawal?.amount}</strong> to{" "}
            <strong>{selectedWithdrawal?.withdrawal_phone_number}</strong>?
          </Typography>

          <TextField
            autoFocus
            margin="dense"
            label="Approval Comment/proof => optional"
            type="text"
            fullWidth
            value={approvalComment}
            onChange={(e: any) => setApprovalComment(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Agent Phone Number
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={agentPhoneNumber}
              label="Phone"
              onChange={(e) => setAgentPhoneNumber(e.target.value)}
            >
              {phoneNumbers.map((phone, i) => (
                <MenuItem key={i} value={phone.phone}>
                  {phone.phone} | {phone.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Close</Button>
          <Button onClick={() => handleApprove()}>Approve</Button>
        </DialogActions>
      </Dialog>

      <FullPageLoader open={isLoading || isLoadingPhoneNumbers} />
    </Container>
  );
}

export default WithDrawals;
