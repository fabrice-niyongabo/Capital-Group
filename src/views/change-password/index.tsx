import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import FullPageLoader from "compoents/full-page-loader";
import { errorHandler, setAuthHeaders, toastMessage } from "lib/util";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers";

function ChangePassword() {
  const { token, userDetails } = useSelector(
    (state: RootState) => state.userReducer
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      if (form.oldPassword.trim() === "") {
        toastMessage("ERROR", "Veuillez entrer votre mot de passe actuel.");
        return;
      }
      if (form.newPassword.trim() === "") {
        toastMessage("ERROR", "Veuillez entrer un nouveau mot de passe.");
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        toastMessage("ERROR", "Les mots de passe ne correspondent pas.");
        return;
      }
      setIsLoading(true);

      const url = userDetails?.role === "admin" ? "/admin/pwd" : "/pwd";
      const res = await axios.put(
        process.env.REACT_APP_BACKEND_URL + url,
        {
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        },
        setAuthHeaders(token || "")
      );
      toastMessage("SUCCESS", res.data.message);
      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
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
          Comparaison des Plans
        </Typography>

        <form style={{ marginTop: 20 }} onSubmit={handleSubmit}>
          <TextField
            type="password"
            label="Current Password"
            fullWidth
            sx={{ mb: 2 }}
            value={form.oldPassword}
            onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
          />
          <TextField
            type="password"
            label="New Password"
            fullWidth
            sx={{ mb: 2 }}
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
          <TextField
            type="password"
            label="Confirm New Password"
            fullWidth
            sx={{ mb: 2 }}
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          <Button variant="contained" color="primary" type="submit">
            Change Password
          </Button>
        </form>
      </Paper>
      <FullPageLoader open={isLoading} />
    </Container>
  );
}

export default ChangePassword;
