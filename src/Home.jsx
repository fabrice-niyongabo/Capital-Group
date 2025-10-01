import React from "react";
import "./Home.css";
import { Container, Typography, Paper, Box } from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="md" className="home-container">
      <Box className="home-flex">
        <Box
          className="home-image-box"
          sx={{ display: { xs: "none", md: "block" } }}
        >
          <img
            src="/images/cryptoemogi.jpg"
            alt="Crypto Emoji"
            className="home-image"
          />
        </Box>
        <Box className="home-content-box">
          <Box className="home-title">
            <Typography variant="h4" align="center" gutterBottom>
              Dépôt & Calculateur de Profit Quotidien
            </Typography>
          </Box>
          <Paper className="home-section">
            <Typography variant="h6" gutterBottom>
              À propos de nous
            </Typography>
            <Typography variant="body1" className="home-about-text">
              Bienvenue sur notre plateforme coopérative innovante, conçue pour
              permettre à nos membres d'investir facilement et de recevoir des
              profits quotidiens basés sur un pourcentage défini. Notre mission
              est de rendre l'investissement accessible, transparent et sécurisé
              pour tous. Rejoignez-nous et faites fructifier votre argent en
              toute confiance avec une gestion simple et efficace de vos dépôts.
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              sx={{ mt: 3, mb: 1, fontWeight: 600 }}
            >
              Nos partenaires
            </Typography>
            <Box
              className="home-partners"
              sx={{
                mt: 2,
                display: "flex",
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="/images/financial investment.jpg"
                alt="Financial Investment"
                className="home-partner-image"
              />
              <img
                src="/images/monetary.jpg"
                alt="Monetary"
                className="home-partner-image"
              />
              <img
                src="/images/techwealth.png"
                alt="Tech Wealth"
                className="home-partner-image"
              />
            </Box>
          </Paper>
          {/* Deposit form and history moved to Plan.jsx */}
        </Box>
      </Box>
    </Container>
  );
}
