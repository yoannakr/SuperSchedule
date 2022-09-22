import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import locale from "date-fns/locale/bg";

import styles from "./Schedule.module.scss";
import { InputField, SelectField } from "../../../components/Form";
import { SnackBar } from "../../../components/Snackbar";
import { Employee, Location, ManualSchedule, ShiftType } from "../../../types";
import { getAllCurrentEmployees } from "../../Employee/api/employee/getAllCurrentEmployees";
import { getAllCurrentShiftTypes } from "../../ShiftType/api/getAllCurrentShiftTypes";
import moment from "moment";
import { createManualSchedule } from "../api/createManualSchedule";

type DayOfWeekTemplate = {
  id: number;
  name: string;
};

type CreateManualScheduleOptions = {
  locations: Location[];
  onSaveManualSchedule: any;
};

export const CreateManualSchedule = (props: CreateManualScheduleOptions) => {
  const { locations, onSaveManualSchedule: onSaveEditedPosition } = props;

  const dayOfWeekTemplates: DayOfWeekTemplate[] = [
    {
      id: 1,
      name: "Понеделник и Вторник",
    },
    {
      id: 2,
      name: "Петък и Събота",
    },
  ];

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);

  const [lastRotationDays, setLastRotationDays] = useState<number>(0);
  const [isInvalidLastRotationDays, setIsInvalidLastRotationDays] =
    useState<boolean>(false);

  const [locationId, setLocationId] = useState<number>(0);
  const [isInvalidLocationId, setIsInvalidLocationId] =
    useState<boolean>(false);

  const [employeeId, setEmployeeId] = useState<number>(0);
  const [isInvalidEmployeeId, setIsInvalidEmployeeId] =
    useState<boolean>(false);

  const [shiftTypeId, setShiftTypeId] = useState<number>(0);
  const [isInvalidShiftTypeId, setIsInvalidShiftTypeId] =
    useState<boolean>(false);

  const [previousShiftTypeId, setPreviousShiftTypeId] = useState<number>(0);
  const [isInvalidPreviousShiftTypeId, setIsInvalidPreviousShiftTypeId] =
    useState<boolean>(false);

  const [date, setDate] = useState<Date | null>(moment().toDate() ?? null);
  const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false);

  const [dayOfWeekTemplateId, setDayOfWeekTemplateId] = useState<number>(0);
  const [isInvalidDayOfWeekTemplateId, setIsInvalidDayOfWeekTemplateId] =
    useState<boolean>(false);

  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    onSaveEditedPosition.current = save;
  }, [
    locationId,
    employeeId,
    date,
    shiftTypeId,
    previousShiftTypeId,
    lastRotationDays,
    dayOfWeekTemplateId,
  ]);

  useEffect(() => {
    const getDataAllCurrentEmployees = () => {
      getAllCurrentEmployees()
        .then((response) => {
          const employees: Employee[] = response.data;
          setEmployees(employees);
        })
        .catch((error) =>
          console.log(`GetAllCurrentEmployees not successful because: ${error}`)
        );
    };

    const getDataAllShiftTypes = () => {
      getAllCurrentShiftTypes()
        .then((response) => {
          const shiftTypes: ShiftType[] = response.data;
          setShiftTypes(shiftTypes);
        })
        .catch((error) =>
          console.log(
            `GetAllCurrentShiftTypes not successful because: ${error}`
          )
        );
    };

    getDataAllCurrentEmployees();
    getDataAllShiftTypes();
  }, []);

  const onLastRotationDaysChange = (lastRotationDaysInput: string) => {
    const lastRotationDays: number = +lastRotationDaysInput;
    setLastRotationDays(lastRotationDays);
    validateLastRotationDays(lastRotationDays);
  };

  const validateLastRotationDays = (numberInput: number): boolean => {
    setIsInvalidLastRotationDays(false);

    if (numberInput < 0) {
      setIsInvalidLastRotationDays(true);
      return false;
    }

    return true;
  };

  const onLocationIdChange = (locationIdInput: string) => {
    const locationId: number = +locationIdInput;
    setLocationId(locationId);
    validateSelectedLocation(locationId);
  };

  const validateSelectedLocation = (locationIdInput: number): boolean => {
    setIsInvalidLocationId(false);

    if (locationIdInput <= 0) {
      setIsInvalidLocationId(true);
      return false;
    }

    return true;
  };

  const onEmployeeIdChange = (employeeIdInput: string) => {
    const employeeId: number = +employeeIdInput;
    setEmployeeId(employeeId);
    validateSelectedEmployee(employeeId);
  };

  const validateSelectedEmployee = (employeeIdInput: number): boolean => {
    setIsInvalidEmployeeId(false);

    if (employeeIdInput <= 0) {
      setIsInvalidEmployeeId(true);
      return false;
    }

    return true;
  };

  const onShiftTypeIdChange = (shiftTypeIdInput: string) => {
    const shiftTypeId: number = +shiftTypeIdInput;
    setShiftTypeId(shiftTypeId);
    validateSelectedShiftType(shiftTypeId);
  };

  const validateSelectedShiftType = (shiftTypeIdInput: number): boolean => {
    setIsInvalidShiftTypeId(false);

    if (shiftTypeIdInput <= 0) {
      setIsInvalidShiftTypeId(true);
      return false;
    }

    return true;
  };

  const onPreviousShiftTypeIdChange = (previousShiftTypeIdInput: string) => {
    const previousShiftTypeId: number = +previousShiftTypeIdInput;
    setPreviousShiftTypeId(previousShiftTypeId);
  };

  const onDayOfWeekTemplateIdChange = (dayOfWeekTemplateIdInput: string) => {
    const dayOfWeekTemplateId: number = +dayOfWeekTemplateIdInput;
    setDayOfWeekTemplateId(dayOfWeekTemplateId);
    validateDayOfWeekTemplate(dayOfWeekTemplateId);
  };

  const validateDayOfWeekTemplate = (
    dayOfWeekTemplateIdInput: number
  ): boolean => {
    setIsInvalidDayOfWeekTemplateId(false);

    if (dayOfWeekTemplateIdInput < 0) {
      setIsInvalidDayOfWeekTemplateId(true);
      return false;
    }

    return true;
  };

  const isInputFieldsAreValid = (): boolean => {
    const isValidEmployee: boolean = validateSelectedEmployee(employeeId);
    const isValidLocation: boolean = validateSelectedLocation(locationId);
    const isValidShiftType: boolean = validateSelectedShiftType(shiftTypeId);
    const isValidLastRotationDays: boolean =
      validateLastRotationDays(lastRotationDays);
    const isValidDayOfWeekTemplate: boolean =
      validateDayOfWeekTemplate(dayOfWeekTemplateId);

    return (
      isValidEmployee &&
      isValidLocation &&
      isValidShiftType &&
      isValidLastRotationDays &&
      isValidDayOfWeekTemplate
    );
  };

  const save = async (): Promise<boolean> => {
    let isValid = isInputFieldsAreValid();
    if (isValid) {
      const manualSchedule: ManualSchedule = {
        locationId: locationId,
        employeeId: employeeId,
        shiftTypeId: shiftTypeId,
        removedShiftTypeId: previousShiftTypeId,
        date: moment(date),
        lastRotationDays: lastRotationDays,
        dayOfWeekTemplate: dayOfWeekTemplateId,
      };

      await createManualSchedule({ manualSchedule }).catch((error) => {
        isValid = false;
        setShowError(true);
        console.log(`Create manual schedule not successful because: ${error}`);
      });
    }

    return isValid;
  };

  return (
    <Form className={styles.Form}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
        <Box className={styles.DateContainer}>
          <DatePicker
            inputFormat="dd.MM.yyyy"
            mask="__.__.____"
            label="Дата"
            minDate={new Date("2020-01-01")}
            value={date}
            onChange={setDate}
            renderInput={(params) => (
              <TextField
                {...params}
                className={styles.DatePicker}
                helperText={isInvalidDate ? "Моля, въведете дата" : null}
                error={isInvalidDate}
              />
            )}
          />
        </Box>
      </LocalizationProvider>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <SelectField
            label="Обект"
            ariaLabel="Изберете обект"
            value={locationId}
            onChange={onLocationIdChange}
            options={locations.map((location) => ({
              label: location.name,
              value: location.id,
            }))}
            isInvalid={isInvalidLocationId}
            errorMessage={"Моля, изберете обект"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <SelectField
            label="Служител"
            ariaLabel="Изберете служител"
            value={employeeId}
            onChange={onEmployeeIdChange}
            options={employees.map((employee) => ({
              label: employee.fullName ?? employee.firstName,
              value: employee.id,
            }))}
            isInvalid={isInvalidEmployeeId}
            errorMessage={"Моля, изберете служител"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <SelectField
            label="Смяна"
            ariaLabel="Изберете смяна"
            value={shiftTypeId}
            onChange={onShiftTypeIdChange}
            options={shiftTypes.map((shiftType) => ({
              label: shiftType.name,
              value: shiftType.id,
            }))}
            isInvalid={isInvalidShiftTypeId}
            errorMessage={"Моля, изберете смяна"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <SelectField
            label="Предишна смяна"
            ariaLabel="Изберете предишна смяна"
            value={previousShiftTypeId}
            onChange={onPreviousShiftTypeIdChange}
            options={shiftTypes.map((shiftType) => ({
              label: shiftType.name,
              value: shiftType.id,
            }))}
            hasHelpIcon={true}
            helpButtonTooltip={
              "Избира се, ако има такава само. Пример: 22.09.2022 г. Димитър е трябвало да бъде Д, но му е взета смяната и е П. Резултат: избира се в полето смяна П, а за предишна смяна Д"
            }
            isInvalid={isInvalidPreviousShiftTypeId}
            errorMessage={"Моля, изберете предишна смяна"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="number"
            label="Брой ден на редуване"
            min={0}
            value={lastRotationDays}
            onChange={onLastRotationDaysChange}
            hasHelpIcon={true}
            helpButtonTooltip={
              "Въвежда се броят денят, в който се повтаря смяната."
            }
            isInvalid={isInvalidLastRotationDays}
            errorMessage={"Моля, въведете положително число"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <SelectField
            label="Тип на редуване"
            ariaLabel="Изберете тип на редуване"
            value={dayOfWeekTemplateId}
            onChange={onDayOfWeekTemplateIdChange}
            options={dayOfWeekTemplates.map((dayOfWeekTemplate) => ({
              label: dayOfWeekTemplate.name,
              value: dayOfWeekTemplate.id,
            }))}
            isInvalid={isInvalidDayOfWeekTemplateId}
            errorMessage={"Моля, изберете тип на редуване"}
          />
        </Form.Group>
      </Row>

      <SnackBar
        isOpen={showError}
        messages={["Моля, проверете връзката с интернет."]}
        setIsOpen={setShowError}
        severity={"error"}
        alertTitle={"Неуспешен запис!"}
      />
    </Form>
  );
};
