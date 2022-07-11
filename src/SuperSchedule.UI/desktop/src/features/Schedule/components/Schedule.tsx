import React, { useEffect, useState } from "react";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Box from "@mui/material/Box";
import moment from "moment";
import locale from "date-fns/locale/bg";

import { getLocations } from "../../../api/getLocations";
import { Location } from "../../../types";
import { LocationSchedule } from "./LocationSchedule";
import styles from "./Schedule.module.scss";
import { ExportExcel } from "./ExportExcel";
import { getErrorsForMonthSchedule } from "../api/getErrorsForMonthSchedule";
import { TabItem, TabList } from "./TabList";
import { UndrawNoLocationsSvg } from "../../../components/Svgs";
import { getWorkingHoursForMonth } from "../api/getWorkingHoursForMonth";

export const Schedule = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>("1");
  const [locationTabItems, setLocationTabItems] = useState<TabItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [monthDate, setMonthDate] = useState<Date | null>(new Date());
  const [errors, setErrors] = useState<string[]>([]);
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
    const getDataLocations = () => {
      getLocations()
        .then((response) => {
          const locations: Location[] = response.data;
          const tabItems: TabItem[] = locations.map((location) =>
            createTabItem(location)
          );
          setLocationTabItems(tabItems);
          setLocations(locations);
        })
        .catch((error) =>
          console.log(`GetAllLocations not successful because: ${error}`)
        );
    };

    getDataLocations();
    getDataWorkingHoursForMonth();
  }, []);

  useEffect(() => {
    getDataErrors();
    getDataWorkingHoursForMonth();
  }, [monthDate]);

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

  const createTabItem = (location: Location): TabItem => ({
    value: location.id.toString(),
    label: location.name,
  });

  const onSelectedLocationChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedLocationId(newValue.toString());
  };

  return (
    <div className={styles.Schedule}>
      {locations.length !== 0 ? (
        <>
          {errors.length !== 0 && (
            <Alert severity="error">
              <AlertTitle>Моля, проверете следните грешки:</AlertTitle>
              {errors.map((error, key) => (
                <p key={key}>{error}</p>
              ))}
            </Alert>
          )}
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
              {/* <ExportExcel csvData={schedules} fileName={"test"} /> */}
            </Box>
          </LocalizationProvider>
          <TabContext value={selectedLocationId}>
            <TabList
              onChange={onSelectedLocationChange}
              items={locationTabItems}
              selectedItem={selectedLocationId}
            />
            {locationTabItems.map((location, key) => (
              <TabPanel
                key={key}
                value={location.value}
                className={styles.TabPanel}
              >
                <LocationSchedule
                  locationId={+location.value}
                  locationName={location.label}
                  monthDate={monthDate}
                  onShiftTypesChange={getDataErrors}
                  workingHoursForMonth={workingHoursForMonth}
                />
              </TabPanel>
            ))}
          </TabContext>
        </>
      ) : (
        <div className={styles.Svg}>
          <UndrawNoLocationsSvg />
          <h4>Няма налични обекти</h4>
        </div>
      )}
    </div>
  );
};
