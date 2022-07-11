import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import SaveIcon from "@mui/icons-material/Save";

import "../../../../App.css";
import styles from "./CreateEmployee.module.scss";
import {
  DropdownMultiselectField,
  InputField,
  SelectField,
} from "../../../../components/Form";
import { Option } from "../../../../components/Form";
import { Position, Location, ShiftType, Employee } from "../../../../types";
import { getPositions } from "../../../../api/getPositions";
import { getLocations } from "../../../../api/getLocations";
import { getShiftTypes } from "../../../../api/getShiftTypes";
import { createEmployee } from "../../api/employee/createEmployee";
import { SnackBar } from "../../../../components/Snackbar";
import { LoadingButton } from "../../../../components/Button";
import { getAllCurrentEmployees } from "../../api/employee/getAllCurrentEmployees";
import { getAllEmployees } from "../../api/employee/getAllEmployees";

export const CreateEmployee = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [isInvalidFirstName, setIsInvalidFirstName] = useState<boolean>(false);

  const [middleName, setMiddleName] = useState<string>("");

  const [lastName, setLastName] = useState<string>("");
  const [isInvalidLastName, setIsInvalidLastName] = useState<boolean>(false);

  const [vacationDays, setVacationDays] = useState<number>(20);
  const [isInvalidVacationDays, setIsInvalidVacationDays] =
    useState<boolean>(false);

  const [positions, setPositions] = useState<Position[]>([]);
  const [positionId, setPositionId] = useState<number>(0);
  const [isInvalidPositionId, setIsInvalidPositionId] =
    useState<boolean>(false);

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<Option[]>([]);
  const [isInvalidSelectedLocations, setIsInvalidSelectedLocations] =
    useState<boolean>(false);

  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [selectedShiftTypes, setSelectedShiftTypes] = useState<Option[]>([]);
  const [isInvalidSelectedShiftTypes, setIsInvalidSelectedShiftTypes] =
    useState<boolean>(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState<number>(0);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    const getDataPositions = () => {
      getPositions()
        .then((response) => {
          const positions: Position[] = response.data;
          setPositions(positions);
          positions != null ? setPositionId(positions[0].id) : setPositionId(0);
        })
        .catch((error) =>
          console.log(`GetAllPositions not successful because: ${error}`)
        );
    };

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

    const getDataShiftTypes = () => {
      getShiftTypes()
        .then((response) => {
          const shiftTypes: ShiftType[] = response.data;
          setShiftTypes(shiftTypes);
        })
        .catch((error) =>
          console.log(`GetAllShiftTypes not successful because: ${error}`)
        );
    };

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

    getDataPositions();
    getDataLocations();
    getDataShiftTypes();
    getDataEmployees();
  }, []);

  const onFirstNameChange = (firstName: string) => {
    setFirstName(firstName);
    validateFirstName(firstName);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onMiddleNameChange = (middleName: string) => {
    setMiddleName(middleName);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onLastNameChange = (lastName: string) => {
    setLastName(lastName);
    validateLastName(lastName);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onVacationDaysChange = (vacationDaysInput: string) => {
    const vacationDays: number = +vacationDaysInput;
    setVacationDays(vacationDays);
    validateVacationDays(vacationDays);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onPositionIdChange = (positionIdInput: string) => {
    const positionId: number = +positionIdInput;
    setPositionId(positionId);
    validateSelectedPosition(positionId);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onSelectLocation = (selectedList: Option[], selectedItem: Option) => {
    setSelectedLocations(selectedList);
    validateSelectedLocations(selectedList);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onRemoveLocation = (selectedList: Option[], removedItem: Option) => {
    setSelectedLocations(selectedList);
    validateSelectedLocations(selectedList);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onSelectShiftType = (selectedList: Option[], selectedItem: Option) => {
    setSelectedShiftTypes(selectedList);
    validateSelectedShiftTypes(selectedList);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onRemoveShiftType = (selectedList: Option[], removedItem: Option) => {
    setSelectedShiftTypes(selectedList);
    validateSelectedShiftTypes(selectedList);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onEmployeeIdChange = (employeeIdInput: string) => {
    const employeeId: number = +employeeIdInput;
    setEmployeeId(employeeId);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
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
    selectedLocationsInput: Option[]
  ): boolean => {
    setIsInvalidSelectedLocations(false);

    if (selectedLocationsInput.length === 0) {
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

  const setDefaultValues = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setVacationDays(20);
    setPositionId(0);
    setSelectedLocations([]);
    setSelectedShiftTypes([]);
    setIsButtonDisabled(true);
  };

  const save = () => {
    const isValid = isInputFieldsAreValid();
    if (isValid) {
      setIsSaving(true);
      const employee: Employee = {
        id: 0,
        firstName,
        middleName,
        lastName,
        vacationDays,
        positionId,
        locationsIds: selectedLocations.map((location) => location.value),
        shiftTypesIds: selectedShiftTypes.map((shiftType) => shiftType.value),
        previousEmployeeId: employeeId,
      };

      createEmployee({ employee })
        .then((response) => {
          setIsSaving(false);
          setShowSuccess(true);
          setDefaultValues();
        })
        .catch((err) => {
          setIsSaving(false);
          setShowError(true);
          console.log(`CreateEmployee not successful because: ${err}`);
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

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <SelectField
            label="Заместник на:"
            ariaLabel="Изберете служител"
            value={employeeId}
            onChange={onEmployeeIdChange}
            options={employees.map((employee) => ({
              label: employee.fullName ?? employee.firstName,
              value: employee.id,
            }))}
          />
        </Form.Group>
      </Row>

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
