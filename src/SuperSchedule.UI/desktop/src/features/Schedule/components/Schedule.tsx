import React, { useEffect, useState } from "react";
import { getLocations } from "../../../api/getLocations";
import { Location } from "../../../types";
import { Tab, Tabs } from "react-bootstrap";
import { LocationSchedule } from "./LocationSchedule";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Box from "@mui/material/Box";
import styles from "./Schedule.module.scss";
import { ExportExcel } from "./ExportExcel";
import moment from "moment";
import { getSchedulesByLocationForPeriod } from "../api/getSchedulesByLocationForPeriod";

export const Schedule = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [monthDate, setMonthDate] = React.useState<Date | null>(new Date());

  // const getSchedules = () =>{
  //   locations.map((location) => {
  //     const startDate = moment(monthDate).startOf("month").format("YYYY-MM-DD");
  //     const endDate = moment(monthDate).endOf("month").format("YYYY-MM-DD");

  //     getSchedulesByLocationForPeriod({
  //       locationId: location.id,
  //       startDate: startDate,
  //       endDate: endDate,
  //     })
  //       .then((response) => {
  //         const schedules: ScheduleModel[] = response.data;

  //         const currentSchedulesRows: ScheduleRow[] = schedules.map(
  //           (schedule) => createScheduleRow(schedule)
  //         );

  //   })
  // }

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

  return (
    <div className={styles.Schedule}>
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
        <Tabs defaultActiveKey={locations[0].id} transition={false}>
          {locations.map((location, key) => (
            <Tab key={key} eventKey={location.id} title={location.name}>
              <LocationSchedule
                locationId={location.id}
                locationName={location.name}
                monthDate={monthDate}
              />
            </Tab>
          ))}
        </Tabs>
      )}
    </div>
  );
};
