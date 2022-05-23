import React, { useEffect, useState } from "react";
import { Employee } from "../../../types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Box from "@mui/material/Box";
import styles from "./Schedule.module.scss";
import { getAllEmployees } from "../../Employee/api/getAllEmployees";
import { PersonalSchedule } from "./PersonalSchedule";

export const PersonalSchedulesList = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("1");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [monthDate, setMonthDate] = React.useState<Date | null>(new Date());

  useEffect(() => {
    const getDataEmployees = () => {
      getAllEmployees()
        .then((response) => {
          const employees: Employee[] = response.data;
          setEmployees(employees);
        })
        .catch((error) =>
          console.log(`GetAllEmployees not successful because: ${error}`)
        );
    };

    getDataEmployees();
  }, []);

  const onSelectedEmployeeChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedEmployeeId(newValue.toString());
  };

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
      {employees.length !== 0 && (
        <TabContext value={selectedEmployeeId}>
          <TabList
            className={styles.TabList}
            onChange={onSelectedEmployeeChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{
              style: {
                display: "none",
              },
            }}
          >
            {employees.map((employee, key) => (
              <Tab
                key={key}
                className={`${styles.Tab} ${
                  selectedEmployeeId === employee.id.toString()
                    ? styles.SelectedTab
                    : ""
                }`}
                value={employee.id.toString()}
                label={`${employee.firstName} ${employee.lastName}`}
              />
            ))}
          </TabList>
          {employees.map((employee, key) => (
            <TabPanel key={key} value={employee.id.toString()}>
              <h1>{employee.lastName}</h1>
              <PersonalSchedule
                employeeId={employee.id}
                monthDate={monthDate}
              />
            </TabPanel>
          ))}
        </TabContext>
      )}
    </div>
  );
};
