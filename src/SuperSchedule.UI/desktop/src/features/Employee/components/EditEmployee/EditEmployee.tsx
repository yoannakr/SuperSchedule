import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";

import styles from "./EditEmployee.module.scss";
import {
  DropdownMultiselectField,
  InputField,
  SelectField,
} from "../../../../components/Form";
import { Option } from "../../../../components/Form";
import { Position, Location, ShiftType, Employee } from "../../../../types";
import { SnackBar } from "../../../../components/Snackbar";
import { updateEmployee } from "../../api/updateEmployee";

type EditEmployeeOptions = {
  employee: Employee | undefined;
  onSaveEditedEmployee: any;
  locations: Location[];
  positions: Position[];
  shiftTypes: ShiftType[];
};

export const EditEmployee = (props: EditEmployeeOptions) => {
  const { employee, onSaveEditedEmployee, locations, positions, shiftTypes } =
    props;

  const [firstName, setFirstName] = useState<string>(employee?.firstName ?? "");
  const [isInvalidFirstName, setIsInvalidFirstName] = useState<boolean>(false);

  const [middleName, setMiddleName] = useState<string>(
    employee?.middleName ?? ""
  );

  const [lastName, setLastName] = useState<string>(employee?.lastName ?? "");
  const [isInvalidLastName, setIsInvalidLastName] = useState<boolean>(false);

  const [vacationDays, setVacationDays] = useState<number>(
    employee?.vacationDays ?? 0
  );
  const [isInvalidVacationDays, setIsInvalidVacationDays] =
    useState<boolean>(false);

  const [positionId, setPositionId] = useState<number>(
    employee?.positionId ?? 0
  );
  const [isInvalidPositionId, setIsInvalidPositionId] =
    useState<boolean>(false);

  const [selectedLocations, setSelectedLocations] = useState<Option[]>(
    locations
      .filter((l) => employee?.locationsIds.includes(l.id))
      .map((location) => {
        return {
          label: location.name,
          value: location.id,
        };
      })
  );
  const [isInvalidSelectedLocations, setIsInvalidSelectedLocations] =
    useState<boolean>(false);

  const [selectedShiftTypes, setSelectedShiftTypes] = useState<Option[]>(
    shiftTypes
      .filter((s) => employee?.shiftTypesIds.includes(s.id))
      .map((shiftType) => {
        return {
          label: shiftType.name,
          value: shiftType.id,
        };
      })
  );
  const [isInvalidSelectedShiftTypes, setIsInvalidSelectedShiftTypes] =
    useState<boolean>(false);

  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    onSaveEditedEmployee.current = save;
  }, [
    firstName,
    middleName,
    lastName,
    vacationDays,
    positionId,
    selectedLocations,
    selectedShiftTypes,
  ]);

  const onFirstNameChange = (firstName: string) => {
    setFirstName(firstName);
    validateFirstName(firstName);
  };

  const onMiddleNameChange = (middleName: string) => {
    setMiddleName(middleName);
  };

  const onLastNameChange = (lastName: string) => {
    setLastName(lastName);
    validateLastName(lastName);
  };

  const onVacationDaysChange = (vacationDaysInput: string) => {
    const vacationDays: number = +vacationDaysInput;
    setVacationDays(vacationDays);
    validateVacationDays(vacationDays);
  };

  const onPositionIdChange = (positionIdInput: string) => {
    const positionId: number = +positionIdInput;
    setPositionId(positionId);
    validateSelectedPosition(positionId);
  };

  const onSelectLocation = (selectedList: Option[], selectedItem: Option) => {
    setSelectedLocations(selectedList);
    validateSelectedLocations(selectedList);
  };

  const onRemoveLocation = (selectedList: Option[], removedItem: Option) => {
    setSelectedLocations(selectedList);
    validateSelectedLocations(selectedList);
  };

  const onSelectShiftType = (selectedList: Option[], selectedItem: Option) => {
    setSelectedShiftTypes(selectedList);
    validateSelectedShiftTypes(selectedList);
  };

  const onRemoveShiftType = (selectedList: Option[], removedItem: Option) => {
    setSelectedShiftTypes(selectedList);
    validateSelectedShiftTypes(selectedList);
  };

  const validateFirstName = (firstNameInput: string): boolean => {
    setIsInvalidFirstName(false);
    const firstNameWithoutNamespaces: string = firstNameInput
      .trimEnd()
      .trimStart();

    if (firstNameWithoutNamespaces.length === 0) {
      setIsInvalidFirstName(true);
      return false;
    }

    return true;
  };

  const validateLastName = (lastNameInput: string): boolean => {
    setIsInvalidLastName(false);
    const lastNameWithoutNamespaces: string = lastNameInput
      .trimEnd()
      .trimStart();

    if (lastNameWithoutNamespaces.length === 0) {
      setIsInvalidLastName(true);
      return false;
    }

    return true;
  };

  const validateVacationDays = (vacationDaysInput: number): boolean => {
    setIsInvalidVacationDays(false);

    if (vacationDaysInput <= 0) {
      setIsInvalidVacationDays(true);
      return false;
    }

    return true;
  };

  const validateSelectedPosition = (positionIdInput: number): boolean => {
    setIsInvalidPositionId(false);

    if (positionIdInput <= 0) {
      setIsInvalidPositionId(true);
      return false;
    }

    return true;
  };

  const validateSelectedLocations = (
    selectedLocationsInput: Option[] | undefined
  ): boolean => {
    setIsInvalidSelectedLocations(false);

    if (
      selectedLocationsInput === undefined ||
      selectedLocationsInput.length === 0
    ) {
      setIsInvalidSelectedLocations(true);
      return false;
    }

    return true;
  };

  const validateSelectedShiftTypes = (
    selectedShiftTypesInput: Option[]
  ): boolean => {
    setIsInvalidSelectedShiftTypes(false);

    if (selectedShiftTypesInput.length === 0) {
      setIsInvalidSelectedShiftTypes(true);
      return false;
    }

    return true;
  };

  const isInputFieldsAreValid = (): boolean => {
    const isValidFirstName: boolean = validateFirstName(firstName);
    const isValidLastName: boolean = validateLastName(lastName);
    const isValidVacationDays: boolean = validateVacationDays(vacationDays);
    const isValidSelectedPosition: boolean =
      validateSelectedPosition(positionId);
    const isValidSelectedLocations: boolean =
      validateSelectedLocations(selectedLocations);
    const isValidSelectedShiftTypes: boolean =
      validateSelectedShiftTypes(selectedShiftTypes);

    return (
      isValidFirstName &&
      isValidLastName &&
      isValidVacationDays &&
      isValidSelectedPosition &&
      isValidSelectedLocations &&
      isValidSelectedShiftTypes
    );
  };

  const save = () => {
    const isValid = isInputFieldsAreValid();
    if (isValid) {
      const editedEmployee: Employee = {
        id: employee?.id ?? 0,
        firstName,
        middleName,
        lastName,
        vacationDays,
        positionId,
        isDeleted: false,
        locationsIds:
          selectedLocations?.map((location) => location.value) ?? [],
        shiftTypesIds: selectedShiftTypes.map((shiftType) => shiftType.value),
      };
      if (employee !== undefined) {
        employee.firstName = firstName;
        employee.middleName = middleName;
        employee.lastName = lastName;
        employee.vacationDays = vacationDays;
        employee.positionId = positionId;
        employee.positionName = positions.find(
          (p) => p.id === positionId
        )?.name;
        employee.locationsIds =
          selectedLocations?.map((location) => location.value) ?? [];
        employee.shiftTypesIds = selectedShiftTypes.map(
          (shiftType) => shiftType.value
        );
      }

      updateEmployee({ employee: editedEmployee }).catch((err) => {
        setShowError(true);
        console.log(`CreateEmployee not successful because: ${err}`);
      });
    }
  };

  return (
    <Form className={styles.Form}>
      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Име"
            value={firstName}
            onChange={onFirstNameChange}
            hasHelpIcon={false}
            helpButtonTooltip={""}
            isInvalid={isInvalidFirstName}
            errorMessage={"Моля, въведете име"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Презиме"
            value={middleName}
            onChange={onMiddleNameChange}
            hasHelpIcon={false}
            helpButtonTooltip={""}
            isInvalid={false}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Фамилия"
            value={lastName}
            onChange={onLastNameChange}
            hasHelpIcon={false}
            helpButtonTooltip={""}
            isInvalid={isInvalidLastName}
            errorMessage={"Моля, въведете фамилия"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="number"
            label="Брой дни отпуска"
            min={1}
            value={vacationDays}
            onChange={onVacationDaysChange}
            hasHelpIcon={false}
            helpButtonTooltip={""}
            isInvalid={isInvalidVacationDays}
            errorMessage={"Моля, въведете число по-голям от 0"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <SelectField
            label="Позиция"
            ariaLabel="Изберете позиция"
            value={positionId}
            onChange={onPositionIdChange}
            options={positions.map((position) => ({
              label: position.name,
              value: position.id,
            }))}
            isInvalid={isInvalidPositionId}
            errorMessage={"Моля, изберете позиция"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <DropdownMultiselectField
            label="Обекти"
            placeholder="Изберете обект/и"
            options={locations.map((location) => ({
              label: location.name,
              value: location.id,
            }))}
            selectedValues={selectedLocations}
            onSelect={onSelectLocation}
            onRemove={onRemoveLocation}
            isInvalid={isInvalidSelectedLocations}
            errorMessage={"Моля, изберете обект"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <DropdownMultiselectField
            label="Смени"
            placeholder="Изберете смяна/и"
            options={shiftTypes.map((shiftType) => ({
              label: shiftType.name,
              value: shiftType.id,
            }))}
            selectedValues={selectedShiftTypes}
            onSelect={onSelectShiftType}
            onRemove={onRemoveShiftType}
            isInvalid={isInvalidSelectedShiftTypes}
            errorMessage={"Моля, изберете смяна"}
          />
        </Form.Group>
      </Row>

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
