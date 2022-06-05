import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Leave } from "../../../../types";
import { GridActionsCellItem, GridColumns, GridRowId } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import Box from "@mui/material/Box";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import styles from "./LeavesAndSickLeave.module.scss";
import moment from "moment";
import { getLeavesForEmployee } from "../../api/leave/getLeavesForEmployee";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@mui/material/Badge";
import { DataGrid } from "../../../../components/DataGrid";
import { CreateLeave } from "./CreateLeave";
import { Dialog } from "../../../../components/Dialog";
import { SnackBar } from "../../../../components/Snackbar";
import { EditLeave } from "./EditLeave";
import { deleteLeave } from "../../api/leave/deleteLeave";
import { getLeaveDatesForEmployee } from "../../api/leave/getLeaveDatesForEmployee";

type LeaveRow = {
  id: number;
  fromDateFormatted: string;
  toDateFormatted: string;
  fromDate: moment.Moment;
  toDate: moment.Moment;
  leaveTypeId: number;
  leaveTypeName?: string;
  comment: string;
};

type EmployeeLeavesAndSickLeaveOptions = {
  employeeId: number;
};

export const EmployeeLeavesAndSickLeave = (
  props: EmployeeLeavesAndSickLeaveOptions
) => {
  const { employeeId } = props;
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(
    new Date()
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(
    moment().add(1, "days").toDate()
  );

  const [days, setDays] = useState<Date[]>([]);
  const [leaves, setLeaves] = useState<LeaveRow[]>([]);

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showSuccessCreated, setShowSuccessCreated] = useState<boolean>(false);
  const [showSuccessEditing, setShowSuccessEditing] = useState<boolean>(false);
  const [showSuccessDeleted, setShowSuccessDeleted] = useState<boolean>(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRow>();

  const onCreateNewLeave = useRef(async (): Promise<boolean> => {
    return false;
  });

  const onSaveEditedLeave = useRef(async (): Promise<boolean> => {
    return false;
  });

  useEffect(() => {
    const startDateParam = moment(filterStartDate).format("YYYY-MM-DD");
    const endDateParam = moment(filterEndDate).format("YYYY-MM-DD");

    const getDataEmployeeLeavesAndSickLeave = () => {
      getLeavesForEmployee({
        employeeId: employeeId,
        startDate: startDateParam,
        endDate: endDateParam,
      })
        .then((response) => {
          const leaves: Leave[] = response.data;
          const leaveRows: LeaveRow[] = leaves.map((leave) => ({
            id: leave.id,
            fromDateFormatted: moment(leave.fromDate).format("DD.MM.yyyy"),
            toDateFormatted: moment(leave.toDate).format("DD.MM.yyyy"),
            fromDate: leave.fromDate,
            toDate: leave.toDate,
            leaveTypeId: leave.leaveTypeId,
            leaveTypeName: leave.leaveTypeName,
            comment: leave.comment,
          }));
          setLeaves(leaveRows);
        })
        .catch((error) =>
          console.log(`GetLeavesForEmployee not successful because: ${error}`)
        );
    };

    const getDataLeaveDatesForEmployee = () => {
      getLeaveDatesForEmployee({
        employeeId,
        startDate: startDateParam,
        endDate: endDateParam,
      }).then((response) => {
        const dates: Date[] = response.data;
        setDays(dates);
      });
    };

    getDataEmployeeLeavesAndSickLeave();
    getDataLeaveDatesForEmployee();
  }, [
    filterStartDate,
    filterEndDate,
    showSuccessCreated,
    showSuccessEditing,
    showSuccessDeleted,
  ]);

  const onShowEditDialog = useCallback(
    (id: GridRowId, row: LeaveRow) => () => {
      setSelectedLeave(row);
      setShowEditDialog(true);
    },
    []
  );

  const onShowDeleteAlertMessage = useCallback(
    (id: GridRowId, row: LeaveRow) => () => {
      setSelectedLeave(row);
      setShowDeleteAlert(true);
    },
    []
  );

  const deleteDataLeave = () => {
    deleteLeave({ leaveId: selectedLeave?.id ?? 0 }).then(() => {});
    setLeaves((prevLeaves) =>
      prevLeaves.filter((leave) => leave.id !== selectedLeave?.id)
    );

    setShowDeleteAlert(false);
    setShowSuccessDeleted(true);
  };

  const columns = useMemo<GridColumns<Leave>>(
    () => [
      { field: "fromDateFormatted", headerName: "От дата", flex: 1 },
      { field: "toDateFormatted", headerName: "До дата", flex: 1 },
      { field: "leaveTypeName", headerName: "Основание", flex: 1 },
      { field: "comment", headerName: "Бележка", flex: 1 },
      {
        field: "actions",
        type: "actions",
        width: 80,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Редактирай"
            onClick={onShowEditDialog(params.id, params.row)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Изтрий"
            onClick={onShowDeleteAlertMessage(params.id, params.row)}
          />,
        ],
      },
    ],
    [onShowEditDialog, onShowDeleteAlertMessage]
  );

  const onCreate = () => {
    setShowCreate(true);
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box className={styles.DatesContainer}>
          <DatePicker
            inputFormat="dd.MM.yyyy"
            label="От дата"
            minDate={new Date("2020-01-01")}
            mask="__.__.____"
            value={filterStartDate}
            onChange={setFilterStartDate}
            renderInput={(params) => (
              <TextField
                className={styles.DatePicker}
                {...params}
                helperText={null}
              />
            )}
          />
          <DatePicker
            inputFormat="dd.MM.yyyy"
            label="До дата"
            minDate={new Date("2020-01-01")}
            mask="__.__.____"
            value={filterEndDate}
            onChange={setFilterEndDate}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
        </Box>
      </LocalizationProvider>

      <div className={styles.AddButtonWithCaption}>
        <caption>
          <IconButton onClick={onCreate}>
            <AddCircleIcon className={styles.AddButton} />
          </IconButton>
          Отпуски и болнични
        </caption>
      </div>

      <div className={styles.LeavesContainer}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <StaticDatePicker
            className={styles.StaticDatePicker}
            inputFormat="dd.MM.yyyy"
            minDate={new Date("2020-01-01")}
            mask="__.__.____"
            value={null}
            onChange={() => {}}
            disableHighlightToday={true}
            renderInput={() => <></>}
            showToolbar={false}
            renderDay={(day, _value, DayComponentProps) => {
              const removeTimeFromDay = moment(day).startOf("day").toDate();
              const isDayIncluded = days.find((d) =>
                moment(d).isSame(removeTimeFromDay)
              );
              const isDayMarked = isDayIncluded !== undefined;
              const isSelected =
                !DayComponentProps.outsideCurrentMonth && isDayMarked;

              return (
                <Badge
                  key={day.toString()}
                  overlap="circular"
                  badgeContent={isSelected ? "🌚" : undefined}
                >
                  <PickersDay {...DayComponentProps} />
                </Badge>
              );
            }}
          />
        </LocalizationProvider>
        <DataGrid className={styles.DataGrid} columns={columns} rows={leaves} />
      </div>

      <Dialog
        showDialog={showCreate}
        dialogContent={
          <CreateLeave
            employeeId={employeeId}
            onCreateNewLeave={onCreateNewLeave}
          />
        }
        setShowDialog={setShowCreate}
        dialogTitle={"Създаване на отпуска/болничен"}
        onAccept={async () => {
          const isValid: boolean = await onCreateNewLeave.current();
          if (isValid) {
            setShowCreate(false);
            setShowSuccessCreated(true);
          }
        }}
        acceptMessage={"Запис"}
        cancelMessage={"Отказ"}
      />

      <Dialog
        showDialog={showEditDialog}
        dialogContent={
          <EditLeave
            leave={{
              id: selectedLeave?.id ?? 0,
              fromDate: selectedLeave?.fromDate ?? moment(),
              toDate: selectedLeave?.toDate ?? moment(),
              leaveTypeId: selectedLeave?.leaveTypeId ?? 1,
              leaveTypeName: selectedLeave?.leaveTypeName,
              comment: selectedLeave?.comment ?? "",
              employeeId: employeeId,
            }}
            onSaveEditedLeave={onSaveEditedLeave}
          />
        }
        setShowDialog={setShowEditDialog}
        dialogTitle={"Редактиране на отпуска/болничен"}
        onAccept={async () => {
          const isValid: boolean = await onSaveEditedLeave.current();
          if (isValid) {
            setShowEditDialog(false);
            setShowSuccessEditing(true);
          }
        }}
        acceptMessage={"Запис"}
        cancelMessage={"Отказ"}
      />

      <Dialog
        showDialog={showDeleteAlert}
        dialogContent={`Сигурни ли сте, че искате да изтриете отпуската/болничния за периода ${selectedLeave?.fromDateFormatted} - ${selectedLeave?.toDateFormatted}?`}
        setShowDialog={setShowDeleteAlert}
        dialogTitle={"Внимание"}
        onAccept={deleteDataLeave}
        acceptMessage={"Да"}
        cancelMessage={"Не"}
      />

      <SnackBar
        isOpen={showSuccessCreated}
        messages={["Успешно създаване!"]}
        setIsOpen={setShowSuccessCreated}
        severity={"success"}
        alertTitle={""}
      />

      <SnackBar
        isOpen={showSuccessEditing}
        messages={["Успешно редактиране!"]}
        setIsOpen={setShowSuccessEditing}
        severity={"success"}
        alertTitle={""}
      />

      <SnackBar
        isOpen={showSuccessDeleted}
        messages={["Успешно изтриване!"]}
        setIsOpen={setShowSuccessDeleted}
        severity={"success"}
        alertTitle={""}
      />
    </div>
  );
};
