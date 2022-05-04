import React, { useEffect, useState } from "react";

import "../../../App.css";
import TableCell from "@material-ui/core/TableCell";
import { SelectField } from "../../../components/Form";
import { ShiftType } from "../../../types";

export type ShiftTypeEditableCell = {
  scheduleId: number;
  shiftType: ShiftType;
};

type EditScheduleTableCellProps = {
  shiftTypes: ShiftType[];
  row: ShiftTypeEditableCell;
  onSave: any;
};

export const EditScheduleTableCell = (props: EditScheduleTableCellProps) => {
  const { shiftTypes, row, onSave } = props;
  const isEditMode = true;

  const [previousRow, setPreviousRow] = useState<ShiftTypeEditableCell>(row);
  const [currentRow, setCurrentRow] = useState<ShiftTypeEditableCell>(row);

  const onChangeTest = (shiftTypeId: string) => {
    const newRow: ShiftTypeEditableCell = {
      scheduleId: currentRow.scheduleId,
      shiftType: currentRow.shiftType,
    };
    newRow.shiftType.id = +shiftTypeId;
    setCurrentRow(newRow);
  };

  return (
    <TableCell align="left">
      {isEditMode ? (
        <SelectField
          className="Test"
          value={currentRow.shiftType.id}
          onChange={onChangeTest}
          options={shiftTypes.map((shiftType) => ({
            label: shiftType.name,
            value: shiftType.id,
          }))}
        />
      ) : (
        row.shiftType.name
      )}
    </TableCell>
  );
};
