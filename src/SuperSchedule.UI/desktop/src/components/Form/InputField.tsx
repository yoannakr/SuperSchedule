import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import HelpIcon from "@mui/icons-material/Help";
import React from "react";
import { Form } from "react-bootstrap";

type InputFieldProps = {
  type: string;
  label: string;
  value: number | string;
  onChange: Function;
  min?: number;
  hasHelpIcon: boolean;
  helpButtonTooltip: string;
  isInvalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
};

export const InputField = (props: InputFieldProps) => {
  const {
    type,
    label,
    value,
    onChange,
    min,
    hasHelpIcon,
    helpButtonTooltip,
    isInvalid,
    errorMessage,
    disabled,
  } = props;

  return (
    <>
      <Form.Label>
        {label}
        {hasHelpIcon && (
          <Tooltip title={helpButtonTooltip} arrow>
            <IconButton>
              <HelpIcon />
            </IconButton>
          </Tooltip>
        )}
      </Form.Label>
      <Form.Control
        type={type}
        min={min}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.currentTarget.value)
        }
        isInvalid={isInvalid}
        disabled={disabled}
      />
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </>
  );
};
