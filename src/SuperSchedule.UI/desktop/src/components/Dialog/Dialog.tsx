import React from "react";
import { Dialog as DialogMui } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "react-bootstrap";

type DialogOptions = {
  className?: string;
  showDialog: boolean;
  dialogContent: any;
  setShowDialog: any;
  dialogTitle: string;
  onAccept: any;
  acceptMessage: string;
  cancelMessage: string;
};

export const Dialog = (props: DialogOptions) => {
  const {
    className,
    showDialog,
    dialogContent,
    setShowDialog,
    dialogTitle,
    onAccept,
    acceptMessage,
    cancelMessage,
  } = props;

  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    <DialogMui
      className={className}
      open={showDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>{dialogContent}</DialogContent>
      <DialogActions>
        <Button onClick={onAccept}>{acceptMessage}</Button>
        <Button onClick={handleClose} autoFocus>
          {cancelMessage}
        </Button>
      </DialogActions>
    </DialogMui>
  );
};
