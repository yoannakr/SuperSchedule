import React, { useEffect, useState } from "react";

import styles from "./Schedule.module.scss";
import TableCell from "@material-ui/core/TableCell";
import { SelectField } from "../../../components/Form";
import { ShiftType } from "../../../types";

export type ShiftTypeEditableCell = {
  scheduleId: number;
  shiftType: ShiftType;
};

type EditScheduleTableCellProps = {
  className: string;
  shiftTypes: ShiftType[];
  row: ShiftTypeEditableCell;
  isEditMode: boolean;
};

export const EditScheduleTableCell = (props: EditScheduleTableCellProps) => {
  const { className, shiftTypes, row, isEditMode } = props;

  const [currentShiftTypeId, setCurrentShiftTypeId] = useState<number>(
    row.shiftType.id
  );

  useEffect(() => {
    setCurrentShiftTypeId(row.shiftType.id);
  }, [row.shiftType.id]);

  const onShiftTypeChange = (shiftTypeId: string) => {
    row.shiftType.id = +shiftTypeId;
    setCurrentShiftTypeId(+shiftTypeId);
  };

  return (
    <TableCell align="left" className={className}>
      {isEditMode ? (
        <SelectField
          className={styles.EditScheduleTableCell}
          value={currentShiftTypeId}
          onChange={onShiftTypeChange}
          options={shiftTypes.map((shiftType) => ({
            label: shiftType.abbreviation,
            value: shiftType.id,
          }))}
        />
      ) : (
        row.shiftType.abbreviation
      )}
    </TableCell>
  );
};
