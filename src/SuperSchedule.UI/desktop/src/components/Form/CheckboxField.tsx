import React from "react";
import { Form } from "react-bootstrap";

type CheckboxFieldProps = {
  label: string;
  value: number | string;
  onChange: Function;
};

export const CheckboxField = (props: CheckboxFieldProps) => {
  const { label, value, onChange } = props;

  return (
    <>
      <Form.Check
        label={label}
        value={value}
        type="checkbox"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.currentTarget.value)
        }
      />
    </>
  );
};
