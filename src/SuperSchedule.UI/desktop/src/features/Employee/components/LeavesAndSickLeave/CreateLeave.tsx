import React, { useEffect, useState } from "react";
import { Row, Form } from "react-bootstrap";
import { Leave } from "../../../../types";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import SaveIcon from "@mui/icons-material/Save";
import locale from "date-fns/locale/bg";

import styles from "./LeavesAndSickLeave.module.scss";
import moment from "moment";
import { SelectField } from "../../../../components/Form";
import { createLeave } from "../../api/leave/createLeave";
import { LoadingButton } from "../../../../components/Button";
import { SnackBar } from "../../../../components/Snackbar";

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

type CreateLeaveOptions = {
  employeeId: number;
  onCreateNewLeave: any;
};

export const CreateLeave = (props: CreateLeaveOptions) => {
  const { employeeId, onCreateNewLeave } = props;

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [isInvalidStartDate, setIsInvalidStartDate] = useState<boolean>(false);

  const [endDate, setEndDate] = useState<Date | null>(
    moment().add(1, "days").toDate()
  );
  const [isInvalidEndDate, setIsInvalidEndDate] = useState<boolean>(false);

  const [leaves, setLeaves] = useState<LeaveRow[]>([]);

  const [comment, setComment] = useState<string>("");

  const [leaveTypeId, setLeaveTypeId] = useState<number>(1);
  const [isInvalidLeaveTypeId, setIsInvalidLeaveTypeId] =
    useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showErrorNoConnection, setShowErrorNoConnection] =
    useState<boolean>(false);
  const [showErrorOnCreating, setShowErrorOnCreating] =
    useState<boolean>(false);
  const [errorsOnCreating, setErrorsOnCreating] = useState<string[]>([]);

  useEffect(() => {
    onCreateNewLeave.current = save;
  }, [startDate, endDate, leaveTypeId, comment]);

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

  const onCommentChange = (comment: string) => {
    setComment(comment);
  };

  const onLeaveTypeIdChange = (leaveTypeIdInput: string) => {
    setLeaveTypeId(+leaveTypeIdInput);

    validateLeaveTypeId(+leaveTypeIdInput);
  };

  const validateStartDate = (startDateInput: Date | null): boolean => {
    setIsInvalidStartDate(false);

    if (startDateInput === null) {
      setIsInvalidStartDate(true);
      return false;
    }

    return true;
  };

  const validateEndDate = (endDateInput: Date | null): boolean => {
    setIsInvalidEndDate(false);

    if (endDateInput === null) {
      setIsInvalidEndDate(true);
      return false;
    }

    return true;
  };

  const validateLeaveTypeId = (leaveTypeIdInput: number): boolean => {
    setIsInvalidLeaveTypeId(false);

    if (leaveTypeIdInput === 0) {
      setIsInvalidLeaveTypeId(true);
      return false;
    }

    return true;
  };

  const isInputFieldsAreValid = (): boolean => {
    const isValidStartDate: boolean = validateStartDate(startDate);
    const isValidEndDate: boolean = validateEndDate(endDate);
    const isValidLeaveTypeId: boolean = validateLeaveTypeId(leaveTypeId);

    return isValidStartDate && isValidEndDate && isValidLeaveTypeId;
  };

  const save = async (): Promise<boolean> => {
    let isValid = isInputFieldsAreValid();
    if (isValid) {
      setIsSaving(true);
      const leave: Leave = {
        id: 0,
        fromDate: moment(startDate),
        toDate: moment(endDate),
        leaveTypeId,
        comment,
        employeeId,
      };

      await createLeave({ leave }).catch((error) => {
        if (error.response !== undefined) {
          setShowErrorOnCreating(true);
          setErrorsOnCreating(error.response.data);
        } else {
          setShowErrorNoConnection(true);
          console.log(`CreateLeave not successful because: ${error}`);
        }

        isValid = false;
      });
    }

    return isValid;
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
        <Box className={styles.DatesContainer}>
          <DatePicker
            inputFormat="dd.MM.yyyy"
            mask="__.__.____"
            label="От дата"
            minDate={new Date("2020-01-01")}
            value={startDate}
            onChange={setStartDate}
            renderInput={(params) => (
              <TextField
                {...params}
                className={styles.DatePicker}
                helperText={
                  isInvalidStartDate ? "Моля, въведете начална дата" : null
                }
                error={isInvalidStartDate}
              />
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
              <TextField
                {...params}
                helperText={
                  isInvalidEndDate ? "Моля, въведете крайна дата" : null
                }
                error={isInvalidEndDate}
              />
            )}
          />
        </Box>
      </LocalizationProvider>

      <Form.Group as={Row} className={styles.Row}>
        <SelectField
          label="Основание"
          value={leaveTypeId}
          onChange={onLeaveTypeIdChange}
          options={leaveTypes.map((leaveType) => ({
            label: leaveType.name,
            value: leaveType.id,
          }))}
          isInvalid={isInvalidLeaveTypeId}
          errorMessage={"Моля, изберете основание"}
        />
      </Form.Group>

      <Form.Group as={Row} className={styles.Row}>
        <Form.Label>Бележка</Form.Label>
        <Form.Control
          as="textarea"
          maxLength={240}
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onCommentChange(e.currentTarget.value)
          }
        />
      </Form.Group>

      <SnackBar
        isOpen={showErrorNoConnection}
        messages={["Моля, проверете връзката с интернет."]}
        setIsOpen={setShowErrorNoConnection}
        severity={"error"}
        alertTitle={"Неуспешно създаване!"}
      />

      <SnackBar
        isOpen={showErrorOnCreating}
        messages={errorsOnCreating}
        setIsOpen={setShowErrorOnCreating}
        severity={"error"}
        alertTitle={"Неуспешно създаване!"}
      />
    </div>
  );
};
