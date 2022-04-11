import React from "react";
import { Form } from "react-bootstrap";

type Option = {
  label: string;
  value: string | number;
};

type SelectFieldProps = {
  label: string;
  ariaLabel: string;
  value: any;
  onChange: any;
  options: Option[];
};

export const SelectField = (props: SelectFieldProps) => {
  const { label, ariaLabel, value, onChange, options } = props;

  return (
    <>
      <Form.Label>{label}</Form.Label>
      <Form.Select
        aria-label={ariaLabel}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onChange(e.currentTarget.value)
        }
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
    </>
  );
};
