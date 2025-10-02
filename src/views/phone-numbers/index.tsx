import {
  Box,
  Button,
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
import { useNavigate } from "react-router-dom";
import { RootState } from "store/reducers";

interface IAgentPhone {
  id: number;
  balance: number;
  created_at: string;
  isdeleted: boolean;
  name: string;
  phone: string;
  updated_at: string;
}

function PhoneNumbers() {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.userReducer);
  const [phoneNumbers, setPhoneNumbers] = useState<IAgentPhone[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IAgentPhone | null>(null);

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

  const handleDeactivate = async () => {
    try {
      setIsLoading(true);
      setShowDialog(false);
      const res = await axios.delete(
        `${APP_CONFIG.BACKEND_URL}/agent/phone/${selectedItem?.id}`,
        setAuthHeaders(token || "")
      );
      toastMessage("SUCCESS", res.data.message);
      fetchPhoneNumbers();
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  return (
    <Container maxWidth="md" className="home-container">
      <Paper className="plan-comparison-section">
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
            Agent Phone Numbers
          </Typography>
          <Button onClick={() => navigate("/phoneNumbers/create")}>
            Create New
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {phoneNumbers
                .filter((item) => !item.isdeleted)
                .map((phone, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{phone.name}</TableCell>
                    <TableCell>{phone.phone}</TableCell>
                    <TableCell>{currencyFormatter(phone.balance)}$</TableCell>
                    <TableCell>
                      {phone.isdeleted ? "Inactive" : "Active"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          navigate(`/phoneNumbers/txns/${phone.id}`)
                        }
                      >
                        View Txns
                      </Button>
                      {!phone.isdeleted && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedItem(phone);
                            setShowDialog(true);
                          }}
                        >
                          Delete
                        </Button>
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
            Do you want to delete the agent phone number{" "}
            <strong>{selectedItem?.name}</strong> -
            <strong>{selectedItem?.phone}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Close</Button>
          <Button onClick={() => handleDeactivate()}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default PhoneNumbers;
