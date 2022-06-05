import React, { useState } from "react";
import { Form } from "react-bootstrap";
import SaveIcon from "@mui/icons-material/Save";

import "../../../App.css";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Box from "@mui/material/Box";
import { fillSchedulesForMonth } from "../api/fillSchedulesForMonth";
import moment from "moment";
import { isScheduleFilled } from "../api/isScheduleFilled";
import { SnackBar } from "../../../components/Snackbar";
import { LoadingButton } from "../../../components/Button";
import { Dialog } from "../../../components/Dialog";

export const CreateSchedule = () => {
  const [monthDate, setMonthDate] = React.useState<Date | null>(new Date());
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [showNoConnectionError, setShowNoConnectionError] =
    useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const onMonthDateChange = (monthDateInput: Date | null) => {
    setMonthDate(monthDateInput);
  };

  const handleClose = () => {
    setShowErrors(false);
  };

  const fillSchedules = () => {
    setShowErrors(false);
    setIsSaving(true);
    const stringMonthDate = moment(monthDate).format("YYYY-MM-DD");

    fillSchedulesForMonth({ monthDate: stringMonthDate })
      .then(() => {
        setShowSuccess(true);
        setIsSaving(false);
      })
      .catch((error) => {
        setIsSaving(false);
        setShowNoConnectionError(true);
        console.log(`FillSchedulesForMonth not successful because: ${error}`);
      });
  };

  const save = () => {
    setIsSaving(true);
    const stringMonthDate = moment(monthDate).format("YYYY-MM-DD");

    isScheduleFilled({ monthDate: stringMonthDate })
      .then((response) => {
        const isScheduleFilled: boolean = response.data;
        if (!isScheduleFilled) {
          fillSchedules();
        } else {
          setShowErrors(isScheduleFilled);
        }
        setIsSaving(false);
      })
      .catch(() => {
        setShowNoConnectionError(true);
        setIsSaving(false);
      });
  };

  return (
    <Form className="Form">
      <h1>Нов график</h1>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box m={2}>
          <DatePicker
            inputFormat="MM.yyyy"
            views={["year", "month"]}
            label="Месец и Година"
            mask="__.____"
            minDate={new Date("2020-01-01")}
            value={monthDate}
            onChange={onMonthDateChange}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
        </Box>
      </LocalizationProvider>

      <Dialog
        showDialog={showErrors}
        dialogContent={`График за месец ${moment(monthDate).format(
          "MM.YYYY"
        )} съществува. Желаете ли да се създаде нов?`}
        setShowDialog={setShowErrors}
        dialogTitle={"Грешка"}
        onAccept={fillSchedules}
        acceptMessage={"Да"}
        cancelMessage={"Не"}
      />

      <SnackBar
        isOpen={showSuccess}
        messages={["Успешно създаване!"]}
        setIsOpen={setShowSuccess}
        severity={"success"}
        alertTitle={""}
      />

      <SnackBar
        isOpen={showNoConnectionError}
        messages={["Моля, проверете връзката с интернет."]}
        setIsOpen={setShowNoConnectionError}
        severity={"error"}
        alertTitle={"Възникна грешка със сървъра"}
      />

      <LoadingButton
        onClick={save}
        loading={isSaving}
        icon={<SaveIcon />}
        content={"Запис"}
      />
    </Form>
  );
};
