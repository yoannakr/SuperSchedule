import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import locale from "date-fns/locale/bg";

import styles from "./EditShiftType.module.scss";
import {
  CheckboxField,
  InputField,
  SelectField,
} from "../../../../components/Form";
import { Day, Location, ShiftType } from "../../../../types";
import { SnackBar } from "../../../../components/Snackbar";
import moment from "moment";
import { updateShiftType } from "../../api/updateShiftType";

type EditShiftTypeOptions = {
  shiftType: ShiftType | undefined;
  onSaveEditedShiftType: any;
  locations: Location[];
  days: Day[];
};

export const EditShiftType = (props: EditShiftTypeOptions) => {
  const { shiftType, onSaveEditedShiftType, locations, days } = props;

  const timeFormat = "HH:mm";

  const [name, setName] = useState<string>(shiftType?.name ?? "");
  const [isInvalidName, setIsInvalidName] = useState<boolean>(false);

  const [abbreviation, setAbbreviation] = useState<string>(
    shiftType?.abbreviation ?? ""
  );
  const [isInvalidAbbreviation, setIsInvalidAbbreviation] =
    useState<boolean>(false);

  const [abbreviationByPassed, setAbbreviationByPassed] = useState<string>(
    shiftType?.abbreviationByPassed ?? ""
  );
  const [isInvalidAbbreviationByPassed, setIsInvalidAbbreviationByPassed] =
    useState<boolean>(false);

  const [startTime, setStartTime] = useState<Date | null>(
    moment(shiftType?.startTime)?.toDate() ?? moment().toDate()
  );
  const [isInvalidStartTime, setIsInvalidStartTime] = useState<boolean>(false);

  const [endTime, setEndTime] = useState<Date | null>(
    moment(shiftType?.endTime)?.toDate() ?? moment().toDate()
  );
  const [isInvalidEndTime, setIsInvalidEndTime] = useState<boolean>(false);

  const [rotationDays, setRotationDays] = useState<number>(
    shiftType?.rotationDays ?? 1
  );
  const [isInvalidRotationDays, setIsInvalidRotationDays] =
    useState<boolean>(false);

  const [priority, setPriority] = useState<number>(shiftType?.priority ?? 1);
  const [isInvalidPriority, setIsInvalidPriority] = useState<boolean>(false);

  const [selectedLocationId, setSelectedLocationId] = useState<number>(
    shiftType?.locationId ?? 0
  );
  const [isInvalidSelectedLocationId, setIsInvalidSelectedLocationId] =
    useState<boolean>(false);

  const [selectedDaysIds, setSelectedDaysId] = useState<number[]>(
    shiftType?.daysIds ?? []
  );
  const [isInvalidSelectedDaysIds, setIsInvalidSelectedDaysIds] =
    useState<boolean>(false);

  const [nightHours, setNightHours] = useState<number>(
    shiftType?.nightHours ?? 0
  );
  const [isInvalidNightHours, setIsInvalidNightHours] =
    useState<boolean>(false);

  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    onSaveEditedShiftType.current = save;
  }, [
    name,
    abbreviation,
    abbreviationByPassed,
    startTime,
    endTime,
    rotationDays,
    priority,
    selectedLocationId,
    nightHours,
    selectedDaysIds,
  ]);

  const onNameChange = (name: string) => {
    setName(name);
    validateName(name);
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

  const onAbbreviationByPassedChange = (abbreviationByPassed: string) => {
    setAbbreviationByPassed(abbreviationByPassed);
    validateAbbreviationByPassed(abbreviationByPassed);
  };

  const validateAbbreviationByPassed = (
    abbreviationByPassedInput: string
  ): boolean => {
    setIsInvalidAbbreviationByPassed(false);
    const abbreviationWithoutNamespaces: string = abbreviationByPassedInput
      .trimEnd()
      .trimStart();

    if (abbreviationWithoutNamespaces.length === 0) {
      setIsInvalidAbbreviationByPassed(true);
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
  };

  const validateSelectedLocationId = (numberInput: number): boolean => {
    setIsInvalidSelectedLocationId(false);

    if (numberInput <= 0) {
      setIsInvalidSelectedLocationId(true);
      return false;
    }

    return true;
  };

  const onNightHoursChange = (nightHoursInput: string) => {
    const nightHours: number = +nightHoursInput;
    setNightHours(nightHours);
    validateNightHours(nightHours);
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
    const isValidAbbreviationByPassed: boolean =
      validateAbbreviationByPassed(abbreviationByPassed);
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
      isValidAbbreviationByPassed &&
      isValidStartTime &&
      isValidEndTime &&
      isValidRotationDays &&
      isValidPriority &&
      isValidSelectedLocationId &&
      isValidNightHours &&
      isValidSelectedDaysIds
    );
  };

  const save = async (): Promise<boolean> => {
    let isValid = isInputFieldsAreValid();
    if (isValid) {
      const editedShiftType: ShiftType = {
        id: shiftType?.id ?? 0,
        name,
        abbreviation,
        abbreviationByPassed,
        startTime: moment(startTime, timeFormat),
        endTime: moment(endTime, timeFormat),
        rotationDays,
        priority,
        locationId: selectedLocationId,
        nightHours,
        daysIds: selectedDaysIds,
      };

      if (shiftType !== undefined) {
        shiftType.name = name;
        shiftType.abbreviation = abbreviation;
        shiftType.abbreviationByPassed = abbreviationByPassed;
        shiftType.startTime = editedShiftType.startTime;
        shiftType.endTime = editedShiftType.endTime;
        shiftType.rotationDays = rotationDays;
        shiftType.priority = priority;
        shiftType.locationId = selectedLocationId;
        shiftType.nightHours = nightHours;
        shiftType.daysIds = selectedDaysIds;
      }

      await updateShiftType({ shiftType: editedShiftType }).catch((error) => {
        isValid = false;
        setShowError(true);
        console.log(`UpdateShiftType not successful because: ${error}`);
      });
    }

    return isValid;
  };

  return (
    <Form className={styles.Form}>
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

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Абревиатура за обходни/лични графици"
            value={abbreviationByPassed}
            onChange={onAbbreviationByPassedChange}
            hasHelpIcon={false}
            helpButtonTooltip={""}
            isInvalid={isInvalidAbbreviationByPassed}
            errorMessage={"Моля, въведете абревиатура обходни/лични графици"}
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
        isOpen={showError}
        messages={["Моля, проверете връзката с интернет."]}
        setIsOpen={setShowError}
        severity={"error"}
        alertTitle={"Неуспешно създаване!"}
      />
    </Form>
  );
};
