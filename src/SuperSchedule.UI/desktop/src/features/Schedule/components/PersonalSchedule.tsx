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
import IconButton from "@material-ui/core/IconButton";
import TableContainer from "@material-ui/core/TableContainer";

import { makeStyles } from "@material-ui/core/styles";
import { getPersonalSchedules } from "../api/getPersonalSchedules";
import { getAllShiftTypesForEmployee } from "../../ShiftType/api/getAllShiftTypesForEmployee";
import { updatePersonalScheduleShiftTypes } from "../api/updatePersonalScheduleShiftTypes";

const useStyles = makeStyles({
  tableCell: {
    padding: "5px",
    textAlign: "center",
    border: "1px solid grey",
    fontSize: "0.7em",
  },
});

export type PersonalScheduleRow = {
  employee?: Employee;
  shiftTypeEditableCells?: ShiftTypeEditableCell[];
};

type PersonalScheduleProps = {
  employeeId: number;
  monthDate: Date | null;
};

type Day = {
  content: number;
  color: string;
  background: string;
};

export const PersonalSchedule = (props: PersonalScheduleProps) => {
  const classes = useStyles();
  const { employeeId, monthDate } = props;

  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [schedulesRow, setSchedulesRow] = useState<PersonalScheduleRow>();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [previousScheduleRow, setPreviousScheduleRow] =
    useState<PersonalScheduleRow>();
  const [countOfDays, setCountOfDays] = useState<number>(0);
  const [days, setDays] = useState<Day[]>([]);

  useEffect(() => {
    const getDataShiftTypes = () => {
      getAllShiftTypesForEmployee({ employeeId })
        .then((response) => {
          const shiftTypes: ShiftType[] = response.data;
          setShiftTypes(shiftTypes);
        })
        .catch((error) =>
          console.log(
            `GetAllShiftTypesForEmployee not successful because: ${error}`
          )
        );
    };

    getDataShiftTypes();
  }, []);

  useEffect(() => {
    const getDataSchedules = () => {
      const monthDateString = moment(monthDate).format("YYYY-MM-DD");

      getPersonalSchedules({
        employeeId: employeeId,
        monthDate: monthDateString,
      })
        .then((response) => {
          const schedule: ScheduleModel = response.data;

          const currentSchedulesRow: PersonalScheduleRow =
            createScheduleRow(schedule);

          if (currentSchedulesRow !== undefined) {
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
          setSchedulesRow(currentSchedulesRow);
          setSchedulesRow(currentSchedulesRow);
        })
        .catch((error) =>
          console.log(`GetPersonalSchedules not successful because: ${error}`)
        );
    };
    if (!isEditMode) getDataSchedules();
  }, [isEditMode, monthDate]);

  const createScheduleRow = (schedule: ScheduleModel): PersonalScheduleRow => ({
    employee: schedule.employee,
    shiftTypeEditableCells: schedule.shiftTypeEditableCells,
  });

  const onDoneEditing = async () => {
    await onSave();
    setIsEditMode(false);
  };

  const onStartEditing = () => {
    setIsEditMode(true);
    const previousScheduleRow: PersonalScheduleRow = {
      employee: schedulesRow?.employee,
      shiftTypeEditableCells: schedulesRow?.shiftTypeEditableCells?.map(
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
    setPreviousScheduleRow(previousScheduleRow);
  };

  const onSave = async () => {
    await updatePersonalScheduleShiftTypes({ scheduleModel: schedulesRow });
  };

  const onRevert = () => {
    setIsEditMode(false);
    setSchedulesRow(previousScheduleRow);
  };

  return (
    <div>
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
                Блок
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
            <TableRow>
              <TableCell
                className={`${styles.FixedColumns} ${styles.TableCell} ${classes.tableCell}`}
              >
                1
              </TableCell>
              <TableCell
                className={`${styles.FixedColumns} ${styles.TableCell} ${classes.tableCell}`}
              >
                <div>{`${schedulesRow?.employee?.firstName} ${schedulesRow?.employee?.lastName}`}</div>
              </TableCell>
              {schedulesRow?.shiftTypeEditableCells !== undefined &&
                schedulesRow.shiftTypeEditableCells.map(
                  (shiftType, shiftTypeId) => (
                    <EditScheduleTableCell
                      className={`${styles.TableCell} ${classes.tableCell}`}
                      key={shiftTypeId}
                      row={shiftType}
                      employee={schedulesRow.employee}
                      shiftTypes={shiftTypes}
                      isEditMode={isEditMode}
                    />
                  )
                )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
