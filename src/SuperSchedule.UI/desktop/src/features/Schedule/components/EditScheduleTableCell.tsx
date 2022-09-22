import React, { useEffect, useState } from "react";

import styles from "./Schedule.module.scss";
import TableCell from "@material-ui/core/TableCell";
import { SelectField } from "../../../components/Form";
import { Employee, ShiftType } from "../../../types";
import { isShiftTypeDefaultType } from "../../../utils";

export type ShiftTypeEditableCell = {
  scheduleId: number;
  shiftType: ShiftType;
  date?: string;
};

type EditScheduleTableCellProps = {
  className: string;
  shiftTypes: ShiftType[];
  row: ShiftTypeEditableCell;
  employee?: Employee;
  isEditMode: boolean;
  showAbbreviationByPassed: boolean;
};

export const EditScheduleTableCell = (props: EditScheduleTableCellProps) => {
  const {
    className,
    shiftTypes,
    row,
    employee,
    isEditMode,
    showAbbreviationByPassed,
  } = props;

  const [currentShiftTypeId, setCurrentShiftTypeId] = useState<number>(
    row.shiftType.id
  );

  const employeeShiftTypes = employee?.shiftTypesIds ?? [];
  const shiftTypesEmployeeCanHave = shiftTypes.filter(
    (s) =>
      employeeShiftTypes.includes(s.id) ||
      isShiftTypeDefaultType(s.locationId ?? 0, s.priority ?? 0)
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
          options={shiftTypesEmployeeCanHave.map((shiftType) => {
            if (
              isShiftTypeDefaultType(
                shiftType.locationId ?? 0,
                shiftType.priority ?? 0
              )
            ) {
              return {
                label: shiftType.name,
                value: shiftType.id,
              };
            }
            return {
              label: showAbbreviationByPassed
                ? shiftType.abbreviationByPassed
                : shiftType.abbreviation,
              value: shiftType.id,
            };
          })}
        />
      ) : showAbbreviationByPassed ? (
        row.shiftType.abbreviationByPassed
      ) : (
        row.shiftType.abbreviation
      )}
    </TableCell>
  );
};
