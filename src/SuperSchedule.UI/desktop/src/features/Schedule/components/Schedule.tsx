import React, { useEffect, useState } from "react";
import { getLocations } from "../../../api/getLocations";
import { Location } from "../../../types";
import { Tab, Tabs } from "react-bootstrap";
import { LocationSchedule } from "./LocationSchedule";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Box from "@mui/material/Box";
import styles from "./Schedule.module.scss";
import { ExportExcel } from "./ExportExcel";
import moment from "moment";
import { getSchedulesByLocationForPeriod } from "../api/getSchedulesByLocationForPeriod";
import { getErrorsForMonthSchedule } from "../api/getErrorsForMonthSchedule";

export const Schedule = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [monthDate, setMonthDate] = useState<Date | null>(new Date());
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const getDataLocations = () => {
      getLocations()
        .then((response) => {
          const locations: Location[] = response.data;
          setLocations(locations);
        })
        .catch((error) =>
          console.log(`GetAllLocations not successful because: ${error}`)
        );
    };

    getDataLocations();
  }, []);

  const getDataErrors = () => {
    const monthDateString = moment(monthDate).format("YYYY-MM-DD");

    getErrorsForMonthSchedule({ monthDate: monthDateString })
      .then((response) => {
        const responseErrors: string[] = response.data;
        setErrors(responseErrors);
      })
      .catch((error) =>
        console.log(
          `GetErrorsForMonthSchedule not successful because: ${error}`
        )
      );
  };

  useEffect(() => {
    getDataErrors();
  }, [monthDate]);

  return (
    <div className={styles.Schedule}>
      {errors.length !== 0 && (
        <Alert severity="error">
          <AlertTitle>Моля, проверете следните грешки:</AlertTitle>
          {errors.map((error, key) => (
            <p key={key}>{error}</p>
          ))}
        </Alert>
      )}
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
          {/* <ExportExcel csvData={schedules} fileName={"test"} /> */}
        </Box>
      </LocalizationProvider>
      {locations.length !== 0 && (
        <Tabs
          defaultActiveKey={locations[0].id}
          transition={false}
          style={{
            flexWrap: "nowrap",
            overflowX: "auto",
            overflowY: "hidden",
          }}
        >
          {locations.map((location, key) => (
            <Tab key={key} eventKey={location.id} title={location.name}>
              <LocationSchedule
                locationId={location.id}
                locationName={location.name}
                monthDate={monthDate}
                onShiftTypesChange={getDataErrors}
              />
            </Tab>
          ))}
        </Tabs>
      )}
    </div>
  );
};
