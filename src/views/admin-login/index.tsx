import {
  Alert,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import FullPageLoader from "compoents/full-page-loader";
import { APP_CONFIG } from "lib/constants";
import { toastMessage } from "lib/util";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, setUser } from "store/actions/user";

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      setLoginError("Veuillez entrer un email et un mot de passe.");
      return;
    }
    try {
      setIsSubmitting(true);
      const endpoint = APP_CONFIG.BACKEND_URL + "/admin/login";

      const res = await axios.post(endpoint, {
        email: loginForm.email,
        password: loginForm.password,
      });

      toastMessage("SUCCESS", "Connecté avec succès");
      dispatch(setToken(res.data.access_token));
      dispatch(
        setUser({
          ...res.data.user_details,
          role: "admin",
        })
      );

      // Redirect to referrer
      const url = new URL(window.location.href);
      const pathValue = url.searchParams.get("redirect");
      if (pathValue && pathValue.trim().length > 1) {
        navigate(`/${pathValue}`);
        return;
      }
    } catch (error) {
      toastMessage("ERROR", "Mot de passe ou email invalide");
    } finally {
      setIsSubmitting(false);
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
          Admin Login
        </Typography>

        <form style={{ marginTop: 20 }} onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            label={"Email"}
            type={"email"}
            fullWidth
            value={loginForm.email}
            onChange={(e: any) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Mot de passe"
            type="password"
            fullWidth
            value={loginForm.password}
            onChange={(e: any) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
          />
          {loginError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {loginError}
            </Alert>
          )}
          <Button variant="contained" color="primary" type="submit">
            Connexion
          </Button>
        </form>
      </Paper>
      <FullPageLoader open={isSubmitting} />
    </Container>
  );
}

export default AdminLogin;
