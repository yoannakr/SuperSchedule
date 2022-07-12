import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import moment from "moment";
import SaveIcon from "@mui/icons-material/Save";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import locale from "date-fns/locale/bg";

import "../../../../App.css";
import styles from "./CreateShiftType.module.scss";
import {
  InputField,
  SelectField,
  CheckboxField,
} from "../../../../components/Form";
import { getLocations } from "../../../../api/getLocations";
import { getDays } from "../../../../api/getDays";
import { createShitType } from "../../api/createShiftType";
import { ShiftType, Day, Location } from "../../../../types/index";
import { SnackBar } from "../../../../components/Snackbar";
import { LoadingButton } from "../../../../components/Button";

export const CreateShiftType = () => {
  const timeFormat = "HH:mm";

  const [name, setName] = useState<string>("");
  const [isInvalidName, setIsInvalidName] = useState<boolean>(false);

  const [abbreviation, setAbbreviation] = useState<string>("");
  const [isInvalidAbbreviation, setIsInvalidAbbreviation] =
    useState<boolean>(false);

  const [startTime, setStartTime] = useState<Date | null>(
    moment().hour(7).minute(0).toDate()
  );
  const [isInvalidStartTime, setIsInvalidStartTime] = useState<boolean>(false);

  const [endTime, setEndTime] = useState<Date | null>(
    moment().hour(19).minute(0).toDate()
  );
  const [isInvalidEndTime, setIsInvalidEndTime] = useState<boolean>(false);

  const [rotationDays, setRotationDays] = useState<number>(1);
  const [isInvalidRotationDays, setIsInvalidRotationDays] =
    useState<boolean>(false);

  const [priority, setPriority] = useState<number>(1);
  const [isInvalidPriority, setIsInvalidPriority] = useState<boolean>(false);

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number>(0);
  const [isInvalidSelectedLocationId, setIsInvalidSelectedLocationId] =
    useState<boolean>(false);

  const [days, setDays] = useState<Day[]>([]);
  const [selectedDaysIds, setSelectedDaysId] = useState<number[]>([]);
  const [isInvalidSelectedDaysIds, setIsInvalidSelectedDaysIds] =
    useState<boolean>(false);

  const [nightHours, setNightHours] = useState<number>(0);
  const [isInvalidNightHours, setIsInvalidNightHours] =
    useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

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

    const getDataDays = () => {
      getDays()
        .then((response) => {
          const days: Day[] = response.data;
          setDays(days);
        })
        .catch((error) =>
          console.log(`GetAllDays not successful because: ${error}`)
        );
    };

    getDataLocations();
    getDataDays();
  }, []);

  const onNameChange = (name: string) => {
    setName(name);
    validateName(name);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const validateName = (nameInput: string): boolean => {
    setIsInvalidName(false);
    const nameWithoutNamespaces: string = nameInput.trimEnd().trimStart();

    if (nameWithoutNamespaces.length === 0) {
      setIsInvalidName(true);
      return false;
    }

    return true;
  };

  const onAbbreviationChange = (abbreviation: string) => {
    setAbbreviation(abbreviation);
    validateAbbreviation(abbreviation);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const validateAbbreviation = (abbreviationInput: string): boolean => {
    setIsInvalidAbbreviation(false);
    const abbreviationWithoutNamespaces: string = abbreviationInput
      .trimEnd()
      .trimStart();

    if (abbreviationWithoutNamespaces.length === 0) {
      setIsInvalidAbbreviation(true);
      return false;
    }

    return true;
  };

  const validateStartTime = (startTimeInput: string): boolean => {
    setIsInvalidStartTime(false);

    if (startTimeInput === null) {
      setIsInvalidStartTime(true);
      return false;
    }

    return true;
  };

  const validateEndTime = (endTimeInput: string): boolean => {
    setIsInvalidEndTime(false);

    if (endTimeInput === null) {
      setIsInvalidEndTime(true);
      return false;
    }

    return true;
  };

  const onRotationDaysChange = (rotationDaysInput: string) => {
    const rotationDays: number = +rotationDaysInput;
    setRotationDays(rotationDays);

    validateRotationDays(rotationDays);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const validateRotationDays = (rotationDaysInput: number): boolean => {
    setIsInvalidRotationDays(false);

    if (rotationDaysInput < 0) {
      setIsInvalidRotationDays(true);
      return false;
    }

    return true;
  };

  const onPriorityChange = (priorityInput: string) => {
    const priority: number = +priorityInput;
    setPriority(priority);
    validatePriority(priority);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const validatePriority = (numberInput: number): boolean => {
    setIsInvalidPriority(false);

    if (numberInput <= 0) {
      setIsInvalidPriority(true);
      return false;
    }

    return true;
  };

  const onSelectedLocationIdChange = (selectedLocationIdInput: string) => {
    const selectedLocationId: number = +selectedLocationIdInput;
    setSelectedLocationId(selectedLocationId);
    validateSelectedLocationId(selectedLocationId);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const validateSelectedLocationId = (numberInput: number): boolean => {
    setIsInvalidSelectedLocationId(false);

    if (numberInput < 0) {
      setIsInvalidSelectedLocationId(true);
      return false;
    }

    return true;
  };

  const onNightHoursChange = (nightHoursInput: string) => {
    const nightHours: number = +nightHoursInput;
    setNightHours(nightHours);
    validateNightHours(nightHours);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const validateNightHours = (numberInput: number): boolean => {
    setIsInvalidNightHours(false);

    if (numberInput < 0) {
      setIsInvalidNightHours(true);
      return false;
    }

    return true;
  };

  const onDayChecked = (selectedDayIdInput: string) => {
    const selectedDayId: number = +selectedDayIdInput;
    const isDayAdded: boolean = selectedDaysIds.includes(selectedDayId);

    if (!isDayAdded) {
      const newSelectedDaysIds = [...selectedDaysIds, selectedDayId];
      setSelectedDaysId(newSelectedDaysIds);
      validateSelectedDaysId(newSelectedDaysIds);

      if (isButtonDisabled) {
        setIsButtonDisabled(false);
      }
    } else {
      const newSelectedDaysIds = selectedDaysIds.filter(
        (id: number) => id !== selectedDayId
      );
      setSelectedDaysId(newSelectedDaysIds);
      validateSelectedDaysId(newSelectedDaysIds);

      setSelectedDaysId(newSelectedDaysIds);
    }
  };

  const validateSelectedDaysId = (selectedDaysIdsInput: number[]): boolean => {
    setIsInvalidSelectedDaysIds(false);

    if (selectedDaysIdsInput.length === 0) {
      setIsInvalidSelectedDaysIds(true);
      return false;
    }

    return true;
  };

  const isInputFieldsAreValid = (): boolean => {
    const isValidName: boolean = validateName(name);
    const isValidAbbreviation: boolean = validateAbbreviation(abbreviation);
    const isValidStartTime: boolean = validateStartTime(
      moment(startTime).format(timeFormat)
    );
    const isValidEndTime: boolean = validateEndTime(
      moment(endTime).format(timeFormat)
    );
    const isValidRotationDays: boolean = validateRotationDays(rotationDays);
    const isValidPriority: boolean = validatePriority(priority);
    const isValidSelectedLocationId: boolean =
      validateSelectedLocationId(selectedLocationId);
    const isValidNightHours: boolean = validateNightHours(nightHours);
    const isValidSelectedDaysIds: boolean =
      validateSelectedDaysId(selectedDaysIds);

    return (
      isValidName &&
      isValidAbbreviation &&
      isValidStartTime &&
      isValidEndTime &&
      isValidRotationDays &&
      isValidPriority &&
      isValidSelectedLocationId &&
      isValidNightHours &&
      isValidSelectedDaysIds
    );
  };

  const setDefaultValues = () => {
    setName("");
    setAbbreviation("");
    setStartTime(moment().hour(7).minute(0).toDate());
    setEndTime(moment().hour(19).minute(0).toDate());
    setRotationDays(0);
    setPriority(1);
    setSelectedLocationId(0);
    setNightHours(0);
    setSelectedDaysId([]);
    setIsButtonDisabled(true);
  };

  const save = async () => {
    const isValid = isInputFieldsAreValid();
    if (isValid) {
      setIsSaving(true);
      const shiftType: ShiftType = {
        id: 0,
        name,
        abbreviation,
        startTime: moment(startTime, timeFormat),
        endTime: moment(endTime, timeFormat),
        rotationDays,
        priority,
        locationId: selectedLocationId,
        nightHours,
        daysIds: selectedDaysIds,
      };

      await createShitType({ shiftType })
        .then(() => {
          setIsSaving(false);
          setShowSuccess(true);
          setDefaultValues();
        })
        .catch((error) => {
          setIsSaving(false);
          setShowError(true);
          console.log(`CreateShiftType not successful because: ${error}`);
        });
    }
  };

  return (
    <Form className="Form">
      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Име"
            value={name}
            onChange={onNameChange}
            hasHelpIcon={false}
            helpButtonTooltip={""}
            isInvalid={isInvalidName}
            errorMessage={"Моля, въведете име"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Абревиатура"
            value={abbreviation}
            onChange={onAbbreviationChange}
            hasHelpIcon={false}
            helpButtonTooltip={""}
            isInvalid={isInvalidAbbreviation}
            errorMessage={"Моля, въведете абревиатура"}
          />
        </Form.Group>
      </Row>

      <Row className={`${styles.Row} ${styles.TimePicker}`}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
          <TimePicker
            label="Начало"
            value={startTime}
            onChange={setStartTime}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={
                  isInvalidStartTime ? "Моля, въведете начален час" : null
                }
                error={isInvalidStartTime}
              />
            )}
          />
        </LocalizationProvider>
      </Row>

      <Row className={`${styles.Row} ${styles.TimePicker}`}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
          <TimePicker
            label="Край"
            value={endTime}
            onChange={setEndTime}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={
                  isInvalidEndTime ? "Моля, въведете краен час" : null
                }
                error={isInvalidEndTime}
              />
            )}
          />
        </LocalizationProvider>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="number"
            label="Брой дни на редуване"
            min={1}
            value={rotationDays}
            onChange={onRotationDaysChange}
            hasHelpIcon={true}
            helpButtonTooltip={"Използва се при 12-часовите смени."}
            isInvalid={isInvalidRotationDays}
            errorMessage={"Моля, въведете число по-голямо от 0"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="number"
            label="Приоритет"
            min={1}
            value={priority}
            onChange={onPriorityChange}
            hasHelpIcon={true}
            helpButtonTooltip={
              "Приоритетът е определящ за създаването на графика."
            }
            isInvalid={isInvalidPriority}
            errorMessage={"Моля, въведете число по-голямо от 0"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <SelectField
            label="Обект"
            ariaLabel="Изберете обект"
            value={selectedLocationId}
            onChange={onSelectedLocationIdChange}
            options={locations.map((location) => ({
              label: location.name,
              value: location.id,
            }))}
            isInvalid={isInvalidSelectedLocationId}
            errorMessage={"Моля, изберете обект"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="number"
            label="Брой нощни часове"
            min={0}
            value={nightHours}
            onChange={onNightHoursChange}
            hasHelpIcon={false}
            helpButtonTooltip={""}
            isInvalid={isInvalidNightHours}
            errorMessage={"Моля, въведете число по-голямо от 0"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.DaysCheckbox}>
        <Form.Group as={Col}>
          {days.map((day: Day) => (
            <CheckboxField
              key={day.id}
              label={day.name}
              value={day.id}
              isChecked={selectedDaysIds.includes(day.id)}
              onChange={onDayChecked}
            />
          ))}
        </Form.Group>
      </Row>

      <Form.Control.Feedback
        style={{
          display: isInvalidSelectedDaysIds ? "block" : "none",
          textAlign: "center",
        }}
        type="invalid"
      >
        {"Моля, изберете ден от седмицата"}
      </Form.Control.Feedback>

      <SnackBar
        isOpen={showSuccess}
        messages={["Успешно създаване!"]}
        setIsOpen={setShowSuccess}
        severity={"success"}
        alertTitle={""}
      />

      <SnackBar
        isOpen={showError}
        messages={["Моля, проверете връзката с интернет."]}
        setIsOpen={setShowError}
        severity={"error"}
        alertTitle={"Неуспешно създаване!"}
      />

      <LoadingButton
        onClick={save}
        loading={isSaving}
        icon={<SaveIcon />}
        content={"Запис"}
        disabled={isButtonDisabled}
      />
    </Form>
  );
};
