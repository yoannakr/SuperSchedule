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
import PrintIcon from "@mui/icons-material/Print";

import { makeStyles } from "@material-ui/core/styles";

import styles from "./Schedule.module.scss";
import {
  EditScheduleTableCell,
  ShiftTypeEditableCell,
} from "./EditScheduleTableCell";
import { Employee, Schedule as ScheduleModel, ShiftType } from "../../../types";
import IconButton from "@material-ui/core/IconButton";
import { updateShiftTypeOfSchedules } from "../api/updateShiftTypeOfSchedules";
import TableContainer from "@material-ui/core/TableContainer";
import { SnackBar } from "../../../components/Snackbar";
import { getSecretaryName } from "../../Setting/api/getSecretaryName";
import { getManagerName } from "../../Setting/api/getManagerName";
import { getAllCurrentShiftTypes } from "../../ShiftType/api/getAllCurrentShiftTypes";
import { getByPassedSchedules } from "../api/getByPassedSchedules";
import { exportPDFByPassedSchedule } from "../utils/exportPDFByPassedSchedule";

const useStyles = makeStyles({
  tableCell: {
    padding: "5px",
    textAlign: "center",
    border: "1px solid grey",
    fontSize: "0.7em",
  },
});

export type LocationScheduleRow = {
  employee: Employee;
  shiftTypeEditableCells: ShiftTypeEditableCell[];
};

type ByPassedScheduleProps = {
  monthDate: Date | null;
  workingHoursForMonth: number;
};

type Day = {
  content: number;
  color: string;
  background: string;
};

export const ByPassedSchedule = (props: ByPassedScheduleProps) => {
  const classes = useStyles();
  const { monthDate, workingHoursForMonth } = props;

  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [schedulesRows, setSchedulesRows] = useState<LocationScheduleRow[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [previousScheduleRow, setPreviousScheduleRow] = useState<
    LocationScheduleRow[]
  >([]);
  const [countOfDays, setCountOfDays] = useState<number>(0);
  const [days, setDays] = useState<Day[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const [secretaryName, setSecretaryName] = useState<string>("");
  const [managerName, setManagerName] = useState<string>("");
  const [scheduleTitle, setScheduleTitle] = useState<string>("");

  const scheduleText = "График".toUpperCase();
  const reportText = "Отчет".toUpperCase();
  const schedueTitle =
    moment().month <= moment(monthDate).month ? scheduleText : reportText;
  const scheduleMonthTitle = `месец ${moment(monthDate).format("MM.YYYY")}г`;

  useEffect(() => {
    const getDataShiftTypes = () => {
      getAllCurrentShiftTypes()
        .then((response) => {
          const shiftTypes: ShiftType[] = response.data;
          setShiftTypes(shiftTypes);
        })
        .catch((error) =>
          console.log(
            `GetAllCurrentShiftTypes not successful because: ${error}`
          )
        );
    };

    const getDataSecretaryName = () => {
      getSecretaryName()
        .then((response) => {
          const responseSecretaryName: string = response.data;
          setSecretaryName(responseSecretaryName);
        })
        .catch((error) =>
          console.log(`GetSecretaryName not successful because: ${error}`)
        );
    };

    const getDataManagerName = () => {
      getManagerName()
        .then((response) => {
          const responseManagerName: string = response.data;
          setManagerName(responseManagerName);
        })
        .catch((error) =>
          console.log(`GetManagerName not successful because: ${error}`)
        );
    };

    getDataShiftTypes();
    getDataSecretaryName();
    getDataManagerName();

    const currentScheduleTitle =
      moment().month() <= moment(monthDate).month() ? scheduleText : reportText;
    setScheduleTitle(currentScheduleTitle);
  }, []);

  useEffect(() => {
    const getDataSchedules = () => {
      const monthDateString = moment(monthDate).format("YYYY-MM-DD");

      getByPassedSchedules({
        monthDate: monthDateString,
      })
        .then((response) => {
          const schedules: ScheduleModel[] = response.data;

          const currentSchedulesRows: LocationScheduleRow[] = schedules.map(
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

    const currentScheduleTitle =
      moment().month() <= moment(monthDate).month() ? scheduleText : reportText;
    setScheduleTitle(currentScheduleTitle);

    if (!isEditMode) {
      getDataSchedules();
      //onShiftTypesChange();
    }
  }, [isEditMode, monthDate]);

  const createScheduleRow = (schedule: ScheduleModel): LocationScheduleRow => ({
    employee: schedule.employee,
    shiftTypeEditableCells: schedule.shiftTypeEditableCells,
  });

  const onDoneEditing = async () => {
    const isSavedSuccessful = await onSave();
    if (isSavedSuccessful) {
      setIsEditMode(false);
    }
  };

  const onStartEditing = () => {
    setIsEditMode(true);
    const previousScheduleRow: LocationScheduleRow[] = schedulesRows.map(
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
                  abbreviationByPassed:
                    shiftTypeEditableCell.shiftType.abbreviationByPassed,
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
    let isSaved = true;
    await updateShiftTypeOfSchedules({ scheduleModels: schedulesRows })
      .then(() => {
        setShowSuccess(true);
      })
      .catch((error) => {
        if (error.response !== undefined) {
          setOpen(true);
          setErrors(error.response.data);
          isSaved = false;
        }
      });

    return isSaved;
  };

  const onRevert = () => {
    setIsEditMode(false);
    setSchedulesRows(previousScheduleRow);
  };

  return (
    <div className={styles.LocationSchedule}>
      <SnackBar
        isOpen={showSuccess}
        messages={["Успешна редакция!"]}
        setIsOpen={setShowSuccess}
        severity={"success"}
        alertTitle={""}
      />
      <SnackBar
        isOpen={open}
        messages={errors}
        setIsOpen={setOpen}
        severity={"error"}
        alertTitle={"Неуспешно записване!"}
      />
      <div className={styles.Header}>
        {!isEditMode && (
          <IconButton
            aria-label="print"
            onClick={() =>
              exportPDFByPassedSchedule(
                "table",
                monthDate,
                "Обходен график",
                secretaryName,
                managerName
              )
            }
          >
            <PrintIcon />
          </IconButton>
        )}

        {isEditMode && (
          <>
            <IconButton aria-label="done" onClick={onDoneEditing}>
              <DoneIcon className={styles.DoneButton} />
            </IconButton>
            <IconButton aria-label="revert" onClick={() => onRevert()}>
              <RevertIcon className={styles.RevertButton} />
            </IconButton>
          </>
        )}

        {!isEditMode && (
          <IconButton aria-label="delete" onClick={onStartEditing}>
            <EditIcon />
          </IconButton>
        )}
        <i style={{ textAlign: "right", width: "100%", marginRight: "20px" }}>
          Месечни часове: {workingHoursForMonth}
        </i>
      </div>

      <div className={styles.Title}>
        <p>{scheduleTitle}</p>
        <p>за дежурствата на обходните охранители</p>
        <p>{scheduleMonthTitle}</p>
      </div>
      <TableContainer className={`${styles.Table}`}>
        <Table id="table">
          <TableHead>
            <TableRow>
              <TableCell
                className={`${styles.TableCell} ${classes.tableCell}`}
              ></TableCell>
              <TableCell
                className={`${styles.FixedColumns} ${styles.TableCell} ${classes.tableCell}`}
              >
                {"Блок"}
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
                  <div>{`${row.employee.fullName}`}</div>
                </TableCell>
                {row.shiftTypeEditableCells.map((shiftType, shiftTypeId) => (
                  <EditScheduleTableCell
                    className={`${styles.TableCell} ${classes.tableCell}`}
                    key={shiftTypeId}
                    row={shiftType}
                    employee={row.employee}
                    shiftTypes={shiftTypes}
                    isEditMode={isEditMode}
                    showAbbreviationByPassed={true}
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
