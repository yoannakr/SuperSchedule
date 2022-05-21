import React, { useEffect, useState } from "react";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";

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
import TableContainer from "@material-ui/core/TableContainer";
import { getShiftTypesByLocationIncludingDefaultBreak } from "../../ShiftType/api/getShiftTypesByLocationIncludingDefaultBreak";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  tableCell: {
    padding: "5px",
    textAlign: "center",
    border: "1px solid grey",
    fontSize: "0.7em",
  },
});

export type ScheduleRow = {
  employee: Employee;
  shiftTypeEditableCells: ShiftTypeEditableCell[];
};

type LocationScheduleProps = {
  locationId: number;
  locationName: string;
  monthDate: Date | null;
};

type Day = {
  content: number;
  color: string;
  background: string;
};

export const LocationSchedule = (props: LocationScheduleProps) => {
  const classes = useStyles();
  const { locationId, locationName, monthDate } = props;

  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [schedulesRows, setSchedulesRows] = useState<ScheduleRow[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [previousScheduleRow, setPreviousScheduleRow] = useState<ScheduleRow[]>(
    []
  );
  const [countOfDays, setCountOfDays] = useState<number>(0);
  const [days, setDays] = useState<Day[]>([]);

  useEffect(() => {
    const getDataShiftTypes = () => {
      getShiftTypesByLocationIncludingDefaultBreak({ locationId })
        .then((response) => {
          const shiftTypes: ShiftType[] = response.data;
          setShiftTypes(shiftTypes);
        })
        .catch((error) =>
          console.log(`GetAllShiftTypes not successful because: ${error}`)
        );
    };

    getDataShiftTypes();
  }, []);

  useEffect(() => {
    const getDataSchedules = () => {
      const startDate = moment(monthDate).startOf("month").format("YYYY-MM-DD");
      const endDate = moment(monthDate).endOf("month").format("YYYY-MM-DD");

      getSchedulesByLocationForPeriod({
        locationId: locationId,
        startDate: startDate,
        endDate: endDate,
      })
        .then((response) => {
          const schedules: ScheduleModel[] = response.data;

          const currentSchedulesRows: ScheduleRow[] = schedules.map(
            (schedule) => createScheduleRow(schedule)
          );

          if (currentSchedulesRows.length !== 0) {
            const monthDays = moment(monthDate).daysInMonth();
            const days: Day[] = [];
            setCountOfDays(monthDays);

            let currentDate = moment(monthDate).startOf("month");
            for (let i = 0; i < monthDays; i++) {
              const weekDay = currentDate.isoWeekday();
              const isWeekend = weekDay === 7 || weekDay === 6;
              const day: Day = {
                content: currentDate.date(),
                color: isWeekend ? "red" : "black",
                background: isWeekend ? "yellow" : "none",
              };

              days.push(day);
              currentDate.add(1, "days");
            }

            setDays(days);
          } else {
            setCountOfDays(0);
            setDays([]);
          }
          setSchedulesRows(currentSchedulesRows);
          setSchedulesRows(currentSchedulesRows);
        })
        .catch((error) =>
          console.log(
            `GetSchedulesByLocationForPeriod not successful because: ${error}`
          )
        );
    };
    if (!isEditMode) getDataSchedules();
  }, [isEditMode, monthDate]);

  const createScheduleRow = (schedule: ScheduleModel): ScheduleRow => ({
    employee: schedule.employee,
    shiftTypeEditableCells: schedule.shiftTypeEditableCells,
  });

  const onDoneEditing = async () => {
    await onSave();
    setIsEditMode(false);
  };

  const onStartEditing = () => {
    setIsEditMode(true);
    const previousScheduleRow: ScheduleRow[] = schedulesRows.map(
      (scheduleRow) => {
        return {
          employee: scheduleRow.employee,
          shiftTypeEditableCells: scheduleRow.shiftTypeEditableCells.map(
            (shiftTypeEditableCell) => {
              return {
                scheduleId: shiftTypeEditableCell.scheduleId,
                shiftType: {
                  id: shiftTypeEditableCell.shiftType.id,
                  name: shiftTypeEditableCell.shiftType.name,
                  abbreviation: shiftTypeEditableCell.shiftType.abbreviation,
                },
              };
            }
          ),
        };
      }
    );
    setPreviousScheduleRow(previousScheduleRow);
  };

  const onSave = async () => {
    let allShiftTypeEditableCells: ShiftTypeEditableCell[] = [];
    schedulesRows.map(
      (scheduleRow) =>
        (allShiftTypeEditableCells = allShiftTypeEditableCells.concat(
          scheduleRow.shiftTypeEditableCells
        ))
    );

    await updateShiftTypeOfSchedules({
      shiftTypeEditableCells: allShiftTypeEditableCells,
    });
  };

  const onRevert = () => {
    setIsEditMode(false);
    setSchedulesRows(previousScheduleRow);
  };

  return (
    <div className={styles.LocationSchedule}>
      {isEditMode && (
        <>
          <IconButton aria-label="done" onClick={onDoneEditing}>
            <DoneIcon />
          </IconButton>
          <IconButton aria-label="revert" onClick={() => onRevert()}>
            <RevertIcon />
          </IconButton>
        </>
      )}
      {!isEditMode && (
        <IconButton aria-label="delete" onClick={onStartEditing}>
          <EditIcon />
        </IconButton>
      )}
      <TableContainer className={`${styles.Table}`}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                className={`${styles.TableCell} ${classes.tableCell}`}
              ></TableCell>
              <TableCell
                className={`${styles.FixedColumns} ${styles.TableCell} ${classes.tableCell}`}
              >
                {locationName}
              </TableCell>
              <TableCell
                colSpan={countOfDays}
                className={`${styles.TableCell} ${classes.tableCell}`}
              >
                дати от месеца
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                className={`${styles.FixedColumns} ${styles.TableCell} ${classes.tableCell}`}
              >
                No
              </TableCell>
              <TableCell
                className={`${styles.FixedColumns} ${styles.TableCell} ${classes.tableCell}`}
              >
                Име, фамилия
              </TableCell>
              {days.map((day, index) => (
                <TableCell
                  key={index}
                  style={{
                    color: day.color,
                    fontWeight: "bold",
                    background: day.background,
                  }}
                  className={`${styles.TableCell} ${classes.tableCell}`}
                >
                  {day.content}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {schedulesRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  className={`${styles.FixedColumns} ${styles.TableCell} ${classes.tableCell}`}
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  className={`${styles.FixedColumns} ${styles.TableCell} ${classes.tableCell}`}
                >
                  <div>{`${row.employee.firstName} ${row.employee.lastName}`}</div>
                </TableCell>
                {row.shiftTypeEditableCells.map((shiftType, shiftTypeId) => (
                  <EditScheduleTableCell
                    className={`${styles.TableCell} ${classes.tableCell}`}
                    key={shiftTypeId}
                    row={shiftType}
                    shiftTypes={shiftTypes}
                    isEditMode={isEditMode}
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
