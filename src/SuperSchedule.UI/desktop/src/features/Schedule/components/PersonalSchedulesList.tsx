import React, { useEffect, useState } from "react";
import { Employee } from "../../../types";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Box from "@mui/material/Box";
import locale from "date-fns/locale/bg";

import styles from "./Schedule.module.scss";
import { getAllEmployees } from "../../Employee/api/employee/getAllEmployees";
import { PersonalSchedule } from "./PersonalSchedule";
import { TabItem, TabList } from "./TabList";
import { UndrawNoEmployeesSvg } from "../../../components/Svgs";

export const PersonalSchedulesList = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("1");
  const [employeeTabItems, setEmployeeTabItems] = useState<TabItem[]>([]);
  const [monthDate, setMonthDate] = React.useState<Date | null>(new Date());

  useEffect(() => {
    const getDataEmployees = () => {
      getAllEmployees()
        .then((response) => {
          const employees: Employee[] = response.data;
          const tabItems: TabItem[] = employees.map((employee) =>
            createTabItem(employee)
          );
          setEmployeeTabItems(tabItems);
        })
        .catch((error) =>
          console.log(`GetAllEmployees not successful because: ${error}`)
        );
    };

    getDataEmployees();
  }, []);

  const createTabItem = (employee: Employee): TabItem => ({
    value: employee.id.toString(),
    label: employee.fullName ?? `${employee.firstName}`,
  });

  const onSelectedEmployeeChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedEmployeeId(newValue.toString());
  };

  return (
    <div className={styles.Schedule}>
      {employeeTabItems.length !== 0 ? (
        <>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
            <Box m={2}>
              <DatePicker
                inputFormat="MM.yyyy"
                views={["year", "month"]}
                label="Месец и Година"
                mask="__.____"
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
          <TabContext value={selectedEmployeeId}>
            <TabList
              onChange={onSelectedEmployeeChange}
              items={employeeTabItems}
              selectedItem={selectedEmployeeId}
            />
            {employeeTabItems.map((employee, key) => (
              <TabPanel
                key={key}
                value={employee.value}
                className={styles.TabPanel}
              >
                <PersonalSchedule
                  employeeId={+employee.value}
                  monthDate={monthDate}
                />
              </TabPanel>
            ))}
          </TabContext>
        </>
      ) : (
        <div className={styles.Svg}>
          <UndrawNoEmployeesSvg />
          <h5>Няма съществуващи служители</h5>
        </div>
      )}
    </div>
  );
};
