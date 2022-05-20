import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

import "../../../App.css";
import styles from "./CreateLocation.module.scss";
import { InputField, SelectField } from "../../../components/Form";
import { Location } from "../../../types";
import { createLocation } from "../api/createLocation";

export const CreateLocation = () => {
  const shiftTypesTemplate = [
    {
      id: 1,
      name: "12 часов",
    },
    {
      id: 2,
      name: "1 и 2 смяна",
    },
    {
      id: 3,
      name: "1 смяна",
    },
  ];
  const [name, setName] = useState<string>("");
  const [abbreviation, setAbbreviation] = useState<string>("");
  const [priority, setPriority] = useState<number>(1);
  const [shiftTypesTemplateId, setShiftTypesTemplateId] = useState<number>(1);

  const onNameChange = (name: string) => {
    setName(name);
  };

  const onAbbreviationChange = (abbreviation: string) => {
    setAbbreviation(abbreviation);
  };

  const onPriorityChange = (priorityInput: string) => {
    const priority: number = +priorityInput;
    setPriority(priority);
  };

  const onShiftTypesTemplateIdChange = (shiftTypeTemplateIdInput: string) => {
    setShiftTypesTemplateId(+shiftTypeTemplateIdInput);
  };

  const save = () => {
    const location: Location = {
      id: 0,
      name,
      abbreviation,
      priority,
      shiftTypesTemplate: shiftTypesTemplateId,
    };

    createLocation({ location }).catch((error) =>
      console.log(`CreateLocation not successful because: ${error}`)
    );
  };

  return (
    <Form className="Form">
      <h1>Обекти</h1>
      <Row>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Име"
            value={name}
            onChange={onNameChange}
            hasHelpIcon={false}
            helpButtonTooltip={""}
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
            hasHelpIcon={false}
            helpButtonTooltip={""}
          />
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <SelectField
            label="Тип на смените"
            ariaLabel="Изберете тип на смените:"
            value={shiftTypesTemplateId}
            onChange={onShiftTypesTemplateIdChange}
            options={shiftTypesTemplate.map((shiftTypeTemplate) => ({
              label: shiftTypeTemplate.name,
              value: shiftTypeTemplate.id,
            }))}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="number"
            label="Приоритет"
            min={1}
            value={priority}
            onChange={onPriorityChange}
            hasHelpIcon={true}
            helpButtonTooltip={
              "Спрямо приоритета се попълва графика. Започва се от най-високия приоритет."
            }
          />
        </Form.Group>
      </Row>

      <Button className="mt-4" variant="primary" onClick={save}>
        Запис
      </Button>
    </Form>
  );
};
