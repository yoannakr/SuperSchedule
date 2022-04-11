import React from "react";
import { Form } from "react-bootstrap";

type InputFieldProps = {
  type: string;
  label: string;
  value: number | string;
  onChange: Function;
  min?: number;
};

export const InputField = (props: InputFieldProps) => {
  const { type, label, value, onChange, min } = props;

  return (
    <>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        min={min}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.currentTarget.value)
        }
      />
    </>
  );
};
