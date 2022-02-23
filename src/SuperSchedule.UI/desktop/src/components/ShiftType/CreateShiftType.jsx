import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, ToastContainer, Toast } from "react-bootstrap";
import styles from "../ShiftType/CreateShiftType.module.scss";
import axios from "axios";
import moment from "moment";

const CreateShiftType = () => {
  const timeFormat = "hh:mm";

  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [startTime, setStartTime] = useState(moment().format(timeFormat));
  const [endTime, setEndTime] = useState(moment().format(timeFormat));
  const [rotationDays, setRotationDays] = useState(1);
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState();

  useEffect(() => {
    const getLocations = () => {
      axios
        .get("http://localhost:5000/locations/GetAllLocations")
        .then((resp) => setLocations(resp.data))
        .catch((err) => console.log(err));
    };

    getLocations();
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

  const save = () => {
    console.log("Save");
    const shiftType = {
      name,
      abbreviation,
      startTime: moment(startTime, timeFormat),
      endTime: moment(endTime, timeFormat),
      rotationDays,
      locationId: selectedLocationId,
    };

    console.log(shiftType);

    axios
      .post("http://localhost:5000/shiftTypes/CreateShiftType", shiftType)
      .catch((err) => console.log("Opss..", err));
  };
  return (
    <div>
      <ToastContainer className="p-3" position="top-center">
        <Toast>
          <Toast.Header closeButton={true}>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
        </Toast>
      </ToastContainer>
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
              value={selectedLocationId}
              onChange={(e) =>
                onSelectedLocationIdChange(e.currentTarget.value)
              }
            >
              <option>Изберете обект</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>

        <Button className="mt-4" variant="primary" onClick={save}>
          Запис
        </Button>
      </Form>
    </div>
  );
};

export default CreateShiftType;
