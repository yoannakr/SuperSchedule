import React from "react";
import { LoadingButton as LoadingButtonMui } from "@mui/lab";

import "../../App.css";

type InputFieldProps = {
  onClick: any;
  loading: boolean;
  icon: any;
  content: string;
  disabled?: boolean;
};

export const LoadingButton = (props: InputFieldProps) => {
  const { onClick, loading, icon, content, disabled } = props;

  return (
    <LoadingButtonMui
      className="Button"
      onClick={onClick}
      loading={loading}
      loadingPosition="start"
      startIcon={icon}
      variant="contained"
      disabled={disabled}
    >
      {content}
    </LoadingButtonMui>
  );
};
