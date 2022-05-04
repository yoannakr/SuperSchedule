import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

import styles from "./CreateLocation.module.scss";
import { InputField } from "../../../components/Form";
import { Location } from "../../../types";
import { createLocation } from "../api/createLocation";

export const CreateLocation = () => {
  const [name, setName] = useState<string>("");
  const [abbreviation, setAbbreviation] = useState<string>("");

  const onNameChange = (name: string) => {
    setName(name);
  };

  const onAbbreviationChange = (abbreviation: string) => {
    setAbbreviation(abbreviation);
  };

  const save = () => {
    const location: Location = {
      id: 0,
      name,
      abbreviation,
    };

    createLocation({ location }).catch((error) =>
      console.log(`CreateLocation not successful because: ${error}`)
    );
  };

  return (
    <Form className={styles.Form}>
      <h1>Обекти</h1>
      <Row>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Име"
            value={name}
            onChange={onNameChange}
          />
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Абревиатура"
            value={abbreviation}
            onChange={onAbbreviationChange}
          />
        </Form.Group>
      </Row>

      <Button className="mt-4" variant="primary" onClick={save}>
        Запис
      </Button>
    </Form>
  );
};
