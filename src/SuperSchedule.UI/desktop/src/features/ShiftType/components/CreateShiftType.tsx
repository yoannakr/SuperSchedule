import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import moment from "moment";

import "../../../App.css";
import styles from "./CreateShiftType.module.scss";
import {
  InputField,
  SelectField,
  CheckboxField,
} from "../../../components/Form";
import { getLocations } from "../../../api/getLocations";
import { getDays } from "../../../api/getDays";
import { createShitType } from "../api/createShiftType";
import { ShiftType, Day, Location } from "../../../types/index";

export const CreateShiftType = () => {
  const timeFormat = "kk:mm";

  const [name, setName] = useState<string>("");
  const [abbreviation, setAbbreviation] = useState<string>("");
  const [startTime, setStartTime] = useState<string>(
    moment().format(timeFormat)
  );
  const [endTime, setEndTime] = useState<string>(moment().format(timeFormat));
  const [rotationDays, setRotationDays] = useState<number>(1);
  const [locations, setLocations] = useState<Location[]>([]);
  const [days, setDays] = useState<Day[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number>(0);
  const [selectedDaysIds, setSelectedDaysId] = useState<number[]>([]);

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
  };

  const onAbbreviationChange = (abbreviation: string) => {
    setAbbreviation(abbreviation);
  };

  const onStartTimeChange = (startTime: string) => {
    setStartTime(startTime);
  };

  const onEndTimeChange = (endTime: string) => {
    setEndTime(endTime);
  };

  const onRotationDaysChange = (rotationDaysInput: string) => {
    const rotationDays: number = +rotationDaysInput;
    setRotationDays(rotationDays);
  };

  const onSelectedLocationIdChange = (selectedLocationIdInput: string) => {
    const selectedLocationId: number = +selectedLocationIdInput;
    setSelectedLocationId(selectedLocationId);
  };

  const onDayChecked = (selectedDayIdInput: string) => {
    const selectedDayId: number = +selectedDayIdInput;
    const isDayAdded: boolean = selectedDaysIds.includes(selectedDayId);

    if (!isDayAdded) {
      setSelectedDaysId([...selectedDaysIds, selectedDayId]);
    } else {
      setSelectedDaysId(
        selectedDaysIds.filter((id: number) => id !== selectedDayId)
      );
    }
  };

  const save = () => {
    const shiftType: ShiftType = {
      id: 0,
      name,
      abbreviation,
      startTime: moment(startTime, timeFormat),
      endTime: moment(endTime, timeFormat),
      rotationDays,
      locationId: selectedLocationId,
      daysIds: selectedDaysIds,
    };

    createShitType({ shiftType }).catch((error) =>
      console.log(`CreateShiftType not successful because: ${error}`)
    );
  };

  return (
    <Form className="Form">
      <h1>Нова смяна</h1>
      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Име"
            value={name}
            onChange={onNameChange}
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
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="time"
            label="Начало"
            value={startTime}
            onChange={onStartTimeChange}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="time"
            label="Край"
            value={endTime}
            onChange={onEndTimeChange}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="number"
            label="Брой дни на редуване"
            min={1}
            value={rotationDays}
            onChange={onRotationDaysChange}
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
              onChange={onDayChecked}
            />
          ))}
        </Form.Group>
      </Row>

      <Button className="mt-4" variant="primary" onClick={save}>
        Запис
      </Button>
    </Form>
  );
};
