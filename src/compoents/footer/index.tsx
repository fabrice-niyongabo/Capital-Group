import { Box, Typography } from "@mui/material";
import React from "react";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        textAlign: "center",
        bgcolor: "#f5f5f5",
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        fontFamily: 'Lato, "Space Mono", Poppins, sans-serif',
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontFamily: "inherit", fontWeight: 600 }}
      >
        © 2025 par Capital Group. Tous droits réservés.
      </Typography>
    </Box>
  );
}

export default Footer;
