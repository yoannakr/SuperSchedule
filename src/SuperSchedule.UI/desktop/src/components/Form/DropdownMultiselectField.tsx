import React from "react";
import { Form } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import "../../App.css";

export type Option = {
  label: string;
  value: number;
};

type DropdownMultiselectFieldProps = {
  label: string;
  placeholder: string;
  options: Option[];
  selectedValues: any;
  onSelect: (selectedList: Option[], selectedItem: Option) => void;
  onRemove: (selectedList: Option[], selectedItem: Option) => void;
  isInvalid?: boolean;
  errorMessage?: string;
};

export const DropdownMultiselectField = (
  props: DropdownMultiselectFieldProps
) => {
  const {
    label,
    placeholder,
    options,
    selectedValues,
    onSelect,
    onRemove,
    isInvalid,
    errorMessage,
  } = props;

  const style = {
    chips: {
      background: "#2f4050",
    },
    searchBox: {
      border: isInvalid ? "1px solid red" : "1px solid #ced4da",
    },
  };

  return (
    <>
      <Form.Label>{label}</Form.Label>
      <Multiselect
        placeholder={placeholder}
        options={options}
        selectedValues={selectedValues}
        onSelect={onSelect}
        onRemove={onRemove}
        displayValue="label"
        showCheckbox={true}
        style={style}
      />
      <Form.Control.Feedback className={isInvalid ? "ShowFeedback" : ""}>
        {errorMessage}
      </Form.Control.Feedback>
    </>
  );
};
