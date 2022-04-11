import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

import styles from "./CreatePosition.module.scss";
import { InputField } from "../../../components/Form";
import { Position } from "../../../types";
import { createPosition } from "../api/createPosition";

export const CreatePosition = () => {
  const [name, setName] = useState<string>("");
  const [abbreviation, setAbbreviation] = useState<string>("");

  const onNameChange = (name: string) => {
    setName(name);
  };

  const onAbbreviationChange = (abbreviation: string) => {
    setAbbreviation(abbreviation);
  };

  const save = () => {
    const position: Position = {
      id: 0,
      name,
      abbreviation,
    };

    createPosition({ position }).catch((error) =>
      console.log(`CreatePosition not successful because: ${error}`)
    );
  };

  return (
    <Form className={styles.Form}>
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
