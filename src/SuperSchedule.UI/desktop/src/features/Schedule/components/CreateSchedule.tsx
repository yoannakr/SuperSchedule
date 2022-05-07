import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

import "../../../App.css";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Box from "@mui/material/Box";
import { fillSchedulesForMonth } from "../api/fillSchedulesForMonth";
import moment from "moment";

export const CreateSchedule = () => {
  const [monthDate, setMonthDate] = React.useState<Date | null>(new Date());
  const [name, setName] = useState<string>("");
  const [abbreviation, setAbbreviation] = useState<string>("");

  const onNameChange = (name: string) => {
    setName(name);
  };

  const onAbbreviationChange = (abbreviation: string) => {
    setAbbreviation(abbreviation);
  };

  const save = () => {
    const stringMonthDate = moment(monthDate).format("YYYY-MM-DD");
    console.log(stringMonthDate);
    fillSchedulesForMonth({ monthDate: stringMonthDate }).catch((error) =>
      console.log(`FillSchedulesForMonth not successful because: ${error}`)
    );
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
            onChange={setMonthDate}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
        </Box>
      </LocalizationProvider>

      <Button className="mt-4" variant="primary" onClick={save}>
        Запис
      </Button>
    </Form>
  );
};
