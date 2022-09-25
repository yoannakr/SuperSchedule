import React, { useEffect, useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Box from "@mui/material/Box";
import moment from "moment";
import locale from "date-fns/locale/bg";

import styles from "./Schedule.module.scss";
import { getWorkingHoursForMonth } from "../api/getWorkingHoursForMonth";
import { ByPassedSchedule } from "./ByPassedSchedule";

export const ByPassedScheduleContainer = () => {
  const [monthDate, setMonthDate] = useState<Date | null>(new Date());
  const [workingHoursForMonth, setWorkingHoursForMonth] = useState<number>(0);

  const getDataWorkingHoursForMonth = () => {
    getWorkingHoursForMonth({
      monthDate: moment(monthDate).format("YYYY-MM-DD"),
    })
      .then((response) => {
        const responseWorkingHoursForMonth: number = response.data;
        setWorkingHoursForMonth(responseWorkingHoursForMonth);
      })
      .catch((error) =>
        console.log(`GetWorkingHoursForMonth not successful because: ${error}`)
      );
  };

  useEffect(() => {
    getDataWorkingHoursForMonth();
  }, [monthDate]);

  return (
    <div className={styles.Schedule}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
        <Box m={2}>
          <DatePicker
            inputFormat="MM.yyyy"
            views={["year", "month"]}
            label="Месец и Година"
            mask="__.____"
            minDate={new Date("2020-01-01")}
            value={monthDate}
            onChange={() => {}}
            onMonthChange={setMonthDate}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
        </Box>
      </LocalizationProvider>

      <ByPassedSchedule
        monthDate={monthDate}
        workingHoursForMonth={workingHoursForMonth}
      />
    </div>
  );
};
