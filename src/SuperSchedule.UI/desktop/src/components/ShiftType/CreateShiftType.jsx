import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import styles from "../ShiftType/CreateShiftType.module.scss";
import axios from "axios";
import moment from "moment";

const CreateShiftType = () => {
  const timeFormat = "kk:mm";

  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [startTime, setStartTime] = useState(moment().format(timeFormat));
  const [endTime, setEndTime] = useState(moment().format(timeFormat));
  const [rotationDays, setRotationDays] = useState(1);
  const [locations, setLocations] = useState([]);
  const [days, setDays] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState();
  const [selectedDaysIds, setSelectedDaysId] = useState([]);

  useEffect(() => {
    const getLocations = () => {
      axios
        .get("http://localhost:5000/locations/GetAllLocations")
        .then((resp) => setLocations(resp.data))
        .catch((err) =>
          console.log(`GetAllLocations not successful because: ${err}`)
        );
    };

    const getDays = () => {
      axios
        .get("http://localhost:5000/days/GetAllDays")
        .then((resp) => setDays(resp.data))
        .catch((err) =>
          console.log(`GetAllDays not successful because: ${err}`)
        );
    };

    getLocations();
    getDays();
  }, []);

  const onNameChange = (name) => {
    setName(name);
  };

  const onAbbreviationChange = (abbreviation) => {
    setAbbreviation(abbreviation);
  };

  const onStartTimeChange = (startTime) => {
    setStartTime(startTime);
  };

  const onEndTimeChange = (endTime) => {
    console.log(typeof moment(endTime, timeFormat));
    setEndTime(endTime);
  };

  const onRotationDaysChange = (rotationDays) => {
    setRotationDays(rotationDays);
  };

  const onSelectedLocationIdChange = (selectedLocationId) => {
    setSelectedLocationId(selectedLocationId);
  };

  const onDayChecked = (dayId) => {
    const isDayAdded = selectedDaysIds.includes(dayId);

    if (!isDayAdded) {
      setSelectedDaysId([...selectedDaysIds, dayId]);
    } else {
      setSelectedDaysId(selectedDaysIds.filter((id) => id !== dayId));
    }
  };

  const save = () => {
    const shiftType = {
      name,
      abbreviation,
      startTime: moment(startTime, timeFormat),
      endTime: moment(endTime, timeFormat),
      rotationDays,
      locationId: selectedLocationId,
      daysIds: selectedDaysIds,
    };

    console.log(shiftType);

    axios
      .post("http://localhost:5000/shiftTypes/CreateShiftType", shiftType)
      .catch((err) =>
        console.log(`CreateShiftType not successful because: ${err}`)
      );
  };
  return (
    <div>
      <Form className={styles.Form}>
        <Row>
          <Form.Group as={Col}>
            <Form.Label>Име</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.currentTarget.value)}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col}>
            <Form.Label>Абревиатура</Form.Label>
            <Form.Control
              type="text"
              value={abbreviation}
              onChange={(e) => onAbbreviationChange(e.currentTarget.value)}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col}>
            <Form.Label>Начало</Form.Label>
            <Form.Control
              type="time"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.currentTarget.value)}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col}>
            <Form.Label>Край</Form.Label>
            <Form.Control
              type="time"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.currentTarget.value)}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col}>
            <Form.Label>Брой дни на редуване</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={rotationDays}
              onChange={(e) => onRotationDaysChange(e.currentTarget.value)}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col}>
            <Form.Label>Обект</Form.Label>
            <Form.Select
              defaultValue="default"
              value={selectedLocationId}
              onChange={(e) =>
                onSelectedLocationIdChange(e.currentTarget.value)
              }
            >
              <option value="default" disabled>
                Изберете обект
              </option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>

        <Row className={styles.DaysCheckbox}>
          {days.map((day) => (
            <Form.Check
              className={styles.DaysCheckbox}
              key={day.id}
              label={day.name}
              value={day.id}
              type="checkbox"
              onChange={(e) => onDayChecked(e.currentTarget.value)}
            />
          ))}
        </Row>

        <Button className="mt-4" variant="primary" onClick={save}>
          Запис
        </Button>
      </Form>
    </div>
  );
};

export default CreateShiftType;
