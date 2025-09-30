import {
  Button,
  Container,
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
import { currencyFormatter, errorHandler, setAuthHeaders } from "lib/util";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "store/reducers";

interface IItem {
  amount: number;
  created_at: string;
  id: 1;
  transaction_type: "CREDIT" | "DEBIT";
  updated_at: string;
  phone: {
    id: number;
    isdeleted: boolean;
    name: string;
    phone: string;
    created_at: string;
    updated_at: string;
  };
  user: {
    email: string;
  };
}

interface ItxnResponse {
  items: IItem[];
  page: number;
  pages: number;
  per_page: number;
  total: number;
}
function PhoneNumberTxns() {
  const params = useParams();
  const { token } = useSelector((state: RootState) => state.userReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [txnsResponse, setTxnsResponse] = useState<ItxnResponse | null>(null);

  const fetchTxns = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${APP_CONFIG.BACKEND_URL}/agent/phone/${
          params.id || 0
        }?limit=1000&page=1`,
        setAuthHeaders(token || "")
      );
      setTxnsResponse(res.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTxns();
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
          Agent Phone Number Transactions ({txnsResponse?.items?.length || 0}) -{" "}
          {txnsResponse?.items[0]?.phone?.phone || ""}
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {txnsResponse?.items?.map((phone, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{currencyFormatter(phone.amount)}$</TableCell>
                  <TableCell>{phone.transaction_type}</TableCell>
                  <TableCell>
                    {new Date(phone.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <FullPageLoader open={isLoading} />
    </Container>
  );
}

export default PhoneNumberTxns;
