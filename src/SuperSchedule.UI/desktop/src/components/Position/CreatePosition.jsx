import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import styles from "../Position/CreatePosition.module.scss";
import axios from "axios";
import moment from "moment";

const CreatePosition = () => {
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");

  const onNameChange = (name) => {
    setName(name);
  };

  const onAbbreviationChange = (abbreviation) => {
    setAbbreviation(abbreviation);
  };

  const save = () => {
    const position = {
      name,
      abbreviation,
    };

    axios
      .post("http://localhost:5000/positions/CreatePosition", position)
      .catch((err) =>
        console.log(`CreatePosition not successful because: ${err}`)
      );
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

export default CreatePosition;
