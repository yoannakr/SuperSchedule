import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

type SnackbarOptions = {
  isOpen: boolean;
  messages: string[];
  setIsOpen: any;
  severity: AlertColor | undefined;
  alertTitle: string;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const SnackBar = (props: SnackbarOptions) => {
  const { isOpen, messages, setIsOpen, severity, alertTitle } = props;

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setIsOpen(false);
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        <AlertTitle>{alertTitle}</AlertTitle>
        {messages.map((message, key) => (
          <p key={key}>{message}</p>
        ))}
      </Alert>
    </Snackbar>
  );
};
