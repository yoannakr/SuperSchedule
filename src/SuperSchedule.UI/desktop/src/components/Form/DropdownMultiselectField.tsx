import React from "react";
import { Form } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";

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
  onRemove: (selectedList: any, selectedItem: any) => void;
};

export const DropdownMultiselectField = (
  props: DropdownMultiselectFieldProps
) => {
  const { label, placeholder, options, selectedValues, onSelect, onRemove } =
    props;

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
      />
    </>
  );
};
