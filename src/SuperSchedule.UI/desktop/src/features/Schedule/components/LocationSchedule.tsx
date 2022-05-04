import React, { useEffect, useState } from "react";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import EditIcon from "@material-ui/icons/EditOutlined";

import styles from "./Schedule.module.scss";
import {
  EditScheduleTableCell,
  ShiftTypeEditableCell,
} from "./EditScheduleTableCell";
import { Employee, Schedule as ScheduleModel, ShiftType } from "../../../types";
import { getSchedulesByLocationForPeriod } from "../api/getSchedulesByLocationForPeriod";
import { getArrayInRange } from "../utils/getArrayInRange";
import IconButton from "@material-ui/core/IconButton";
import { updateShiftTypeOfSchedules } from "../api/updateShiftTypeOfSchedules";
import { getShiftTypes } from "../../../api/getShiftTypes";
import TableContainer from "@material-ui/core/TableContainer";
import { StickyNote2Sharp } from "@mui/icons-material";
import { getShiftTypesByLocation } from "../../ShiftType/api/getShiftTypesByLocation";

export type ScheduleRow = {
  employee: Employee;
  shiftTypeEditableCells: ShiftTypeEditableCell[];
  isEditMode: boolean;
};

type LocationScheduleProps = {
  locationId: number;
};

export const LocationSchedule = (props: LocationScheduleProps) => {
  const { locationId } = props;

  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [schedulesRows, setSchedulesRows] = useState<ScheduleRow[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [previousScheduleRow, setPreviousScheduleRow] = useState<ScheduleRow[]>(
    []
  );
  const [countOfDays, setCountOfDays] = useState<number>(31);
  const [days, setDays] = useState<number[]>([]);

  useEffect(() => {
    const getDataSchedules = () => {
      getSchedulesByLocationForPeriod({
        locationId: locationId,
        startDate: moment("01/10/2022", "DD/MM/YYYY").format("YYYY-MM-DD"),
        endDate: moment("31/10/2022", "DD/MM/YYYY").format("YYYY-MM-DD"),
      })
        .then((response) => {
          const schedules: ScheduleModel[] = response.data;

          const schedulesRows: ScheduleRow[] = schedules.map((schedule) =>
            createScheduleRow(schedule)
          );

          setSchedulesRows(schedulesRows);
          setCountOfDays(schedules.length);
          const days: number[] = getArrayInRange(1, countOfDays);
          setDays(days);
        })
        .catch((error) =>
          console.log(
            `GetSchedulesByLocationForPeriod not successful because: ${error}`
          )
        );
    };

    const getDataShiftTypes = () => {
      getShiftTypesByLocation({ locationId })
        .then((response) => {
          const shiftTypes: ShiftType[] = response.data;
          setShiftTypes(shiftTypes);
        })
        .catch((error) =>
          console.log(`GetAllShiftTypes not successful because: ${error}`)
        );
    };

    getDataSchedules();
    getDataShiftTypes();
  }, []);

  const createScheduleRow = (schedule: ScheduleModel): ScheduleRow => ({
    employee: schedule.employee,
    shiftTypeEditableCells: schedule.shiftTypeEditableCells,
    isEditMode: false,
  });

  const onEditModeChange = () => {
    setIsEditMode(!isEditMode);
    onSave();
  };

  const onSave = () => {
    let allShiftTypeEditableCells: ShiftTypeEditableCell[] = [];
    schedulesRows.map(
      (scheduleRow) =>
        (allShiftTypeEditableCells = allShiftTypeEditableCells.concat(
          scheduleRow.shiftTypeEditableCells
        ))
    );

    console.log(allShiftTypeEditableCells);

    updateShiftTypeOfSchedules({
      shiftTypeEditableCells: allShiftTypeEditableCells,
    });
  };

  const onChange = (
    shiftTypeId: string,
    shiftTypeEditableCell: ShiftTypeEditableCell
  ) => {};

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <IconButton aria-label="delete" onClick={onEditModeChange}>
        <EditIcon />
      </IconButton>
      <TableContainer
        style={{
          width: "100%",
          border: "1px solid black",
          margin: "10px",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ fontSize: 10 }}></TableCell>
              <TableCell align="center" style={{ fontSize: 10 }}>
                blok 1
              </TableCell>
              <TableCell align="center" style={{ fontSize: 10 }} colSpan={31}>
                дати от месеца
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left" style={{ fontSize: 10 }}>
                No
              </TableCell>
              <TableCell align="left" style={{ fontSize: 10 }}>
                Име, фамилия
              </TableCell>
              {days.map((day, index) => (
                <TableCell key={index} align="center" style={{ fontSize: 10 }}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {schedulesRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  style={{ fontSize: 10 }}
                  className={styles.TableContainer}
                >
                  {index + 1}
                </TableCell>
                <TableCell className={styles.TableContainer}>
                  {row.isEditMode ? (
                    <>
                      {/* <IconButton
                      aria-label="done"
                      onClick={() => onToggleEditMode(row.id)}
                    >
                      <DoneIcon />
                    </IconButton>
                    <IconButton
                      aria-label="revert"
                      onClick={() => onRevert(row.id)}
                    >
                      <RevertIcon />
                    </IconButton> */}
                    </>
                  ) : (
                    <div style={{ fontSize: 10 }}>{row.employee.firstName}</div>
                    // <IconButton
                    //   aria-label="delete"
                    //   onClick={() => onToggleEditMode(row.id)}
                    // >
                    //   <EditIcon />
                    // </IconButton>
                  )}
                </TableCell>
                {row.shiftTypeEditableCells.map((shiftType, shiftTypeId) => (
                  <EditScheduleTableCell
                    key={shiftTypeId}
                    row={shiftType}
                    shiftTypes={shiftTypes}
                    onSave={onChange}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
