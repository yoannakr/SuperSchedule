import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

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
import { createEmployee } from "../../api/createEmployee";

export const CreateEmployee = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [vacationDays, setVacationDays] = useState<number>(20);

  const [positions, setPositions] = useState<Position[]>([]);
  const [positionId, setPositionId] = useState<number>(0);

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<Option[]>([]);

  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [selectedShiftTypes, setSelectedShiftTypes] = useState<Option[]>([]);

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

    getDataPositions();
    getDataLocations();
    getDataShiftTypes();
  }, []);

  const onFirstNameChange = (firstName: string) => {
    setFirstName(firstName);
  };

  const onMiddleNameChange = (middleName: string) => {
    setMiddleName(middleName);
  };

  const onLastNameChange = (lastName: string) => {
    setLastName(lastName);
  };

  const onVacationDaysChange = (vacationDaysInput: string) => {
    const vacationDays: number = +vacationDaysInput;
    setVacationDays(vacationDays);
  };

  const onPositionIdChange = (positionIdInput: string) => {
    const positionId: number = +positionIdInput;
    setPositionId(positionId);
  };

  const onSelectLocation = (selectedList: Option[], selectedItem: Option) => {
    setSelectedLocations(selectedList);
  };

  const onRemoveLocation = (selectedList: Option[], removedItem: Option) => {
    setSelectedLocations(selectedList);
  };

  const onSelectShiftType = (selectedList: Option[], selectedItem: Option) => {
    setSelectedShiftTypes(selectedList);
  };

  const onRemoveShiftType = (selectedList: Option[], removedItem: Option) => {
    setSelectedShiftTypes(selectedList);
  };

  const save = () => {
    const employee: Employee = {
      id: 0,
      firstName,
      middleName,
      lastName,
      vacationDays,
      positionId,
      locationsIds: selectedLocations.map((location) => location.value),
      shiftTypesIds: selectedShiftTypes.map((shiftType) => shiftType.value),
    };

    createEmployee({ employee }).catch((err) =>
      console.log(`CreateEmployee not successful because: ${err}`)
    );
  };

  return (
    <Form className="Form">
      <h1>Служители</h1>
      <Row>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Име"
            value={firstName}
            onChange={onFirstNameChange}
          />
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Презиме"
            value={middleName}
            onChange={onMiddleNameChange}
          />
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Фамилия"
            value={lastName}
            onChange={onLastNameChange}
          />
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <InputField
            type="number"
            label="Брой дни отпуска"
            min={1}
            value={vacationDays}
            onChange={onVacationDaysChange}
          />
        </Form.Group>
      </Row>

      <Row>
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
          />
        </Form.Group>
      </Row>

      <Row>
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
          />
        </Form.Group>
      </Row>

      <Row>
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
          />
        </Form.Group>
      </Row>

      <Button className="mt-4" variant="primary" onClick={save}>
        Запис
      </Button>
    </Form>
  );
};
