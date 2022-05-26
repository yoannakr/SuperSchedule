import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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

export const CreateSchedule = () => {
  const [monthDate, setMonthDate] = React.useState<Date | null>(new Date());
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const onMonthDateChange = (monthDateInput: Date | null) => {
    setMonthDate(monthDateInput);
    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const handleClose = () => {
    setShowErrors(false);
  };

  const fillSchedules = () => {
    setShowErrors(false);
    const stringMonthDate = moment(monthDate).format("YYYY-MM-DD");

    fillSchedulesForMonth({ monthDate: stringMonthDate })
      .then((response) => {
        setShowSuccess(true);
      })
      .catch((error) =>
        console.log(`FillSchedulesForMonth not successful because: ${error}`)
      );
  };

  const save = () => {
    setIsButtonDisabled(true);
    const stringMonthDate = moment(monthDate).format("YYYY-MM-DD");

    isScheduleFilled({ monthDate: stringMonthDate }).then((response) => {
      const isScheduleFilled: boolean = response.data;
      if (!isScheduleFilled) {
        fillSchedules();
      } else {
        setShowErrors(isScheduleFilled);
      }
      setIsButtonDisabled(false);
    });
  };

  return (
    <Form className="Form">
      <h1>Нов график</h1>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box m={2}>
          <DatePicker
            inputFormat="MM-yyyy"
            views={["year", "month"]}
            label="Месец и Година"
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
        open={showErrors}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Грешка"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`График за месец ${moment(monthDate).format(
              "MM.YYYY"
            )} съществува. Желаете ли да се създаде нов?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={fillSchedules}>Да</Button>
          <Button onClick={handleClose} autoFocus>
            Не
          </Button>
        </DialogActions>
      </Dialog>

      <SnackBar
        isOpen={showSuccess}
        messages={["Успешно създаване!"]}
        setIsOpen={setShowSuccess}
        severity={"success"}
        alertTitle={""}
      />

      <Button
        className="Button"
        variant="primary"
        onClick={save}
        disabled={isButtonDisabled}
      >
        Запис
      </Button>
    </Form>
  );
};
