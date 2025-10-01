import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import FullPageLoader from "compoents/full-page-loader";
import { APP_CONFIG } from "lib/constants";
import { errorHandler, setAuthHeaders, toastMessage } from "lib/util";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store/reducers";

function CreatePhoneNumber() {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.userReducer);
  const [isLoading, setIsLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
  });

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();

      setIsLoading(true);
      const res = await axios.post(
        APP_CONFIG.BACKEND_URL + "/agent/phone",
        form,
        setAuthHeaders(token || "")
      );
      toastMessage("SUCCESS", res.data.message);
      setForm({
        name: "",
        phone: "",
      });
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

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
          Create New Agent Phone Number
        </Typography>

        <form style={{ marginTop: 20 }} onSubmit={handleSubmit}>
          <TextField
            type="text"
            label="Name"
            fullWidth
            sx={{ mb: 2 }}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            type="text"
            label="Phone Number"
            fullWidth
            sx={{ mb: 2 }}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <Stack direction="row" justifyContent="flex-end" gap={2}>
            <Button
              onClick={() => navigate("/phoneNumbers")}
              variant="outlined"
            >
              Back
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Stack>
        </form>
      </Paper>
      <FullPageLoader open={isLoading} />
    </Container>
  );
}

export default CreatePhoneNumber;
