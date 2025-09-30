import { CheckCircle, Info, Warning } from "@mui/icons-material";
import {
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import { IInvestment, IInvestmentResponse } from "types/investments";

function Investments() {
  const { token } = useSelector((state: RootState) => state.userReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [investments, setInvestments] = useState<IInvestmentResponse | null>(
    null
  );
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IInvestment | null>(null);

  const fetchInvestments = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${APP_CONFIG.BACKEND_URL}/investment/all?limit=500&page=1`,
        setAuthHeaders(token || "")
      );
      setInvestments(res.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      if (!selectedItem) return;
      setIsLoading(true);
      setShowDialog(false);
      const res = await axios.put(
        `${APP_CONFIG.BACKEND_URL}/investment/approve`,
        {
          amount: selectedItem?.amount,
          deposit_phone_number: selectedItem?.deposit_phone_number,
        },
        setAuthHeaders(token || "")
      );
      toastMessage("SUCCESS", res.data.message);
      fetchInvestments();
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  return (
    <Container maxWidth="lg" className="home-container">
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
          Investments: {investments?.total || 0} ={" "}
          {currencyFormatter(
            investments?.items
              .filter((item) => item.payment_status === "SUCCESS")
              .reduce(
                (accumulator, currentValue) =>
                  accumulator + Number(currentValue.amount),
                0
              )
          )}
          $
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>User Email</TableCell>
                <TableCell>Agent Phone</TableCell>
                <TableCell>Deposit Phone</TableCell>
                <TableCell>Payment Proof</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {investments?.items.map((inv, i) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(inv.created_at).toDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ width: 50 }} noWrap>
                      <span title={inv.plan.name}> {inv.plan.name}</span>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "blue", fontWeight: "bold" }}
                    >
                      {currencyFormatter(inv.amount)}$
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ width: 100 }} noWrap>
                      <span title={inv.user.email}> {inv.user.email}</span>
                    </Typography>
                  </TableCell>
                  <TableCell>{inv.deposit_phone_number}</TableCell>
                  <TableCell>{inv.agent_phone.phone}</TableCell>
                  <TableCell>
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
                  <TableCell>
                    {inv?.earning_end_date
                      ? new Date(inv.earning_end_date).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    {inv.payment_status === "SUCCESS" && (
                      <Chip
                        icon={<CheckCircle />}
                        label="Approved"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                    {inv.payment_status === "FAILED" && (
                      <Chip
                        icon={<Warning />}
                        label="Rejected"
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                    {inv.payment_status === "PENDING" && (
                      <Chip
                        icon={<Info />}
                        label="Pending"
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {inv.payment_status === "PENDING" && (
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedItem(inv);
                            setShowDialog(true);
                          }}
                        >
                          Approve
                        </Button>
                        {/* <Button size="small" color="secondary">Reject</Button> */}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <FullPageLoader open={isLoading} />
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Do you want to approve the investment of{" "}
            <strong>${selectedItem?.amount}</strong> in the plan{" "}
            <strong>{selectedItem?.plan.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Close</Button>
          <Button onClick={() => handleApprove()}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Investments;
