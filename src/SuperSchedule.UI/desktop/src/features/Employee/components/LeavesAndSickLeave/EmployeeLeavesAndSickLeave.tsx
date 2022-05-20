import React, { useState, useEffect } from "react";
import { Row, Col, Button, Tab, ListGroup, Form } from "react-bootstrap";
import { Leave } from "../../../../types";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import Box from "@mui/material/Box";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";

import styles from "./LeavesAndSickLeave.module.scss";
import moment from "moment";
import { getLeavesForEmployee } from "../../api/getLeavesForEmployee";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@mui/material/Badge";
import { SelectField } from "../../../../components/Form";
import { createLeave } from "../../api/createLeave";

type LeaveTypeEnum = {
  id: number;
  name: string;
};

type LeaveRow = {
  id: number;
  fromDate: string;
  toDate: string;
  leaveType: string;
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

  const [days, setDays] = useState<Date[]>([
    moment(new Date()).startOf("day").toDate(),
    moment(new Date(2022, 4, 8)).startOf("day").toDate(),
  ]);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    moment().add(1, "days").toDate()
  );
  const [comment, setComment] = useState<string>("");
  const [leaves, setLeaves] = useState<LeaveRow[]>([]);
  const [leaveTypeId, setLeaveTypeId] = useState<number>(1);

  const leaveTypes: LeaveTypeEnum[] = [
    {
      id: 1,
      name: "Отпуска",
    },
    {
      id: 2,
      name: "Болничен",
    },
  ];

  const columns: GridColDef[] = [
    { field: "fromDate", headerName: "От дата", width: 100 },
    { field: "toDate", headerName: "До дата", width: 100 },
    { field: "leaveType", headerName: "Основание", width: 100 },
    { field: "comment", headerName: "Бележка", width: 100 },
  ];

  useEffect(() => {
    const getDataEmployeeLeavesAndSickLeave = () => {
      const startDateParam = moment(filterStartDate).format("YYYY-MM-DD");
      const endDateParam = moment(filterEndDate).format("YYYY-MM-DD");

      getLeavesForEmployee({
        employeeId: employeeId,
        startDate: startDateParam,
        endDate: endDateParam,
      })
        .then((response) => {
          const leaves: Leave[] = response.data;
          const leaveRows: LeaveRow[] = leaves.map((leave) => ({
            id: leave.id,
            fromDate: moment(leave.fromDate).format("DD.MM.yyyy"),
            toDate: moment(leave.toDate).format("DD.MM.yyyy"),
            leaveType: leaveTypes[leave.leaveTypeId - 1].name,
            comment: leave.comment,
          }));
          setLeaves(leaveRows);
        })
        .catch((error) =>
          console.log(`GetLeavesForEmployee not successful because: ${error}`)
        );
    };

    getDataEmployeeLeavesAndSickLeave();
  }, []);

  const onCommentChange = (comment: string) => {
    setComment(comment);
  };

  const onLeaveTypeIdChange = (leaveTypeIdInput: string) => {
    setLeaveTypeId(+leaveTypeIdInput);
  };

  const save = () => {
    console.log("StartDate", startDate);
    console.log("EndDate", endDate);
    const leave: Leave = {
      id: 0,
      fromDate: moment(startDate),
      toDate: moment(endDate),
      leaveTypeId,
      comment,
      employeeId,
    };

    createLeave({ leave }).catch((err) =>
      console.log(`CreateLeave not successful because: ${err}`)
    );
  };

  return (
    <div className={styles.List}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box m={2}>
          <DatePicker
            inputFormat="dd.MM.yyyy"
            label="От дата"
            minDate={new Date("2020-01-01")}
            mask="__.__.____"
            value={filterStartDate}
            onChange={setFilterStartDate}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
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

      <div style={{ height: "500px", width: "410px" }}>
        <DataGrid columns={columns} rows={leaves} />
      </div>

      <IconButton onClick={() => console.log("TEs")}>
        <AddCircleIcon />
      </IconButton>
      <IconButton onClick={() => console.log("TEs")}>
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => console.log("TEs")}>
        <ClearIcon />
      </IconButton>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDatePicker
          inputFormat="dd.MM.yyyy"
          minDate={new Date("2020-01-01")}
          mask="__.__.____"
          value={startDate}
          onChange={setStartDate}
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

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box m={2}>
          <DatePicker
            inputFormat="dd.MM.yyyy"
            mask="__.__.____"
            label="От дата"
            minDate={new Date("2020-01-01")}
            value={startDate}
            onChange={setStartDate}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
          <DatePicker
            inputFormat="dd.MM.yyyy"
            mask="__.__.____"
            label="До дата"
            minDate={new Date("2020-01-01")}
            value={endDate}
            onChange={setEndDate}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
        </Box>
      </LocalizationProvider>

      <Form.Group as={Row}>
        <SelectField
          label="Основание"
          value={leaveTypeId}
          onChange={onLeaveTypeIdChange}
          options={leaveTypes.map((leaveType) => ({
            label: leaveType.name,
            value: leaveType.id,
          }))}
        />
      </Form.Group>

      <Form.Label>Бележка</Form.Label>
      <Form.Control
        as="textarea"
        maxLength={240}
        value={comment}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onCommentChange(e.currentTarget.value)
        }
      />

      <Button className="mt-4" variant="primary" onClick={save}>
        Запис
      </Button>
    </div>
  );
};
