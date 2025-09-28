import React from "react";
import { Backdrop, CircularProgress, Theme } from "@mui/material";

interface IFullPageLoader {
  open: boolean;
}

const FullPageLoader: React.FC<IFullPageLoader> = (props) => {
  return (
    <Backdrop
      sx={{
        zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
        color: "#fff",
      }}
      open={props.open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default FullPageLoader;
