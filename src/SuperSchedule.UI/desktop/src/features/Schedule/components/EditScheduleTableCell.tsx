import React, { useEffect, useState } from "react";

import styles from "./Schedule.module.scss";
import TableCell from "@material-ui/core/TableCell";
import { SelectField } from "../../../components/Form";
import { Employee, ShiftType } from "../../../types";

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
};

export const EditScheduleTableCell = (props: EditScheduleTableCellProps) => {
  const { className, shiftTypes, row, employee, isEditMode } = props;

  const [currentShiftTypeId, setCurrentShiftTypeId] = useState<number>(
    row.shiftType.id
  );

  const employeeShiftTypes = employee?.shiftTypesIds ?? [];
  const shiftTypesEmployeeCanHave = shiftTypes.filter(
    (s) =>
      employeeShiftTypes.includes(s.id) ||
      (s.locationId === 0 &&
        (s.priority === 1 ||
          s.priority === 2 ||
          s.priority === 3 ||
          s.priority === 4 ||
          s.priority === 5))
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
              shiftType.locationId === 0 &&
              (shiftType.priority === 1 ||
                shiftType.priority === 2 ||
                shiftType.priority === 4 ||
                shiftType.priority === 5)
            ) {
              return {
                label: shiftType.name,
                value: shiftType.id,
              };
            }
            return {
              label: shiftType.abbreviation,
              value: shiftType.id,
            };
          })}
        />
      ) : (
        row.shiftType.abbreviation
      )}
    </TableCell>
  );
};
