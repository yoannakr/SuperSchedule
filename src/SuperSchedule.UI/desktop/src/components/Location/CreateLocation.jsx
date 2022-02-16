import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import styles from "../Location/CreateLocation.module.scss";
import axios from "axios";

const CreateLocation = () => {
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");

  const onNameChange = (name) => {
    setName(name);
  };

  const onAbbreviationChange = (abbreviation) => {
    setAbbreviation(abbreviation);
  };

  const save = () => {
    const location = {
      name,
      abbreviation,
    };

    axios
      .post("http://localhost:5000/locations", location)
      .catch((err) => console.log("Opss..", err));
  };
  return (
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

      <Button className="mt-4" variant="primary" onClick={save}>
        Запис
      </Button>
    </Form>
  );
};

export default CreateLocation;
