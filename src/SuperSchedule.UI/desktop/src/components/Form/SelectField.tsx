import React from "react";
import { Form } from "react-bootstrap";

type Option = {
  label: string;
  value: string | number;
};

type SelectFieldProps = {
  className?: string;
  label?: string;
  ariaLabel?: string;
  value: any;
  onChange: any;
  options: Option[];
  isInvalid?: boolean;
  errorMessage?: string;
};

export const SelectField = (props: SelectFieldProps) => {
  const {
    className,
    label,
    ariaLabel,
    value,
    onChange,
    options,
    isInvalid,
    errorMessage,
  } = props;

  return (
    <>
      {label != null && <Form.Label>{label}</Form.Label>}
      <Form.Select
        className={className}
        aria-label={ariaLabel}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onChange(e.currentTarget.value)
        }
        isInvalid={isInvalid}
      >
        <option value="0"></option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </>
  );
};
