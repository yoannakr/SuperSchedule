import React from "react";
import { Form } from "react-bootstrap";

type CheckboxFieldProps = {
  label: string;
  value: number | string;
  onChange: Function;
  isChecked: boolean;
};

export const CheckboxField = (props: CheckboxFieldProps) => {
  const { label, value, onChange, isChecked } = props;

  return (
    <>
      <Form.Check
        inline
        label={label}
        value={value}
        type="checkbox"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.currentTarget.value)
        }
        checked={isChecked}
      />
    </>
  );
};
