import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import SaveIcon from "@mui/icons-material/Save";

import "../../../../App.css";
import styles from "./CreateLocation.module.scss";
import { InputField, SelectField } from "../../../../components/Form";
import { Location } from "../../../../types";
import { createLocation } from "../../api/createLocation";
import { SnackBar } from "../../../../components/Snackbar";
import { LoadingButton } from "../../../../components/Button";

export const CreateLocation = () => {
  const shiftTypesTemplate = [
    {
      id: 1,
      name: "12 часови смени",
    },
    {
      id: 2,
      name: "първа и втора смяна",
    },
    {
      id: 3,
      name: "една смяна",
    },
  ];
  const [name, setName] = useState<string>("");
  const [isInvalidName, setIsInvalidName] = useState<boolean>(false);

  const [abbreviation, setAbbreviation] = useState<string>("");
  const [isInvalidAbbreviation, setIsInvalidAbbreviation] =
    useState<boolean>(false);

  const [priority, setPriority] = useState<number>(1);
  const [isInvalidPriority, setIsInvalidPriority] = useState<boolean>(false);

  const [shiftTypesTemplateId, setShiftTypesTemplateId] = useState<number>(1);
  const [isInvalidShiftTypesTemplateId, setIsInvalidShiftTypesTemplateId] =
    useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const onNameChange = (name: string) => {
    setName(name);
    validateName(name);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };
  const validateName = (nameInput: string): boolean => {
    setIsInvalidName(false);
    const nameWithoutNamespaces: string = nameInput.trimEnd().trimStart();

    if (nameWithoutNamespaces.length === 0) {
      setIsInvalidName(true);
      return false;
    }

    return true;
  };

  const onAbbreviationChange = (abbreviation: string) => {
    setAbbreviation(abbreviation);
    validateAbbreviation(abbreviation);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const validateAbbreviation = (abbreviationInput: string): boolean => {
    setIsInvalidAbbreviation(false);
    const abbreviationWithoutNamespaces: string = abbreviationInput
      .trimEnd()
      .trimStart();

    if (abbreviationWithoutNamespaces.length === 0) {
      setIsInvalidAbbreviation(true);
      return false;
    }

    return true;
  };

  const onPriorityChange = (priorityInput: string) => {
    const priority: number = +priorityInput;
    setPriority(priority);
    validatePriority(priority);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const validatePriority = (numberInput: number): boolean => {
    setIsInvalidPriority(false);

    if (numberInput <= 0) {
      setIsInvalidPriority(true);
      return false;
    }

    return true;
  };

  const onShiftTypesTemplateIdChange = (shiftTypeTemplateIdInput: string) => {
    setShiftTypesTemplateId(+shiftTypeTemplateIdInput);
    validateShiftTypesTemplateId(+shiftTypeTemplateIdInput);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const validateShiftTypesTemplateId = (numberInput: number): boolean => {
    setIsInvalidShiftTypesTemplateId(false);

    if (numberInput <= 0) {
      setIsInvalidShiftTypesTemplateId(true);
      return false;
    }

    return true;
  };

  const isInputFieldsAreValid = (): boolean => {
    const isValidName: boolean = validateName(name);
    const isValidAbbreviation: boolean = validateAbbreviation(abbreviation);
    const isValidPriority: boolean = validatePriority(priority);
    const isValidShiftTypesTemplateId: boolean =
      validateShiftTypesTemplateId(shiftTypesTemplateId);

    return (
      isValidName &&
      isValidAbbreviation &&
      isValidPriority &&
      isValidShiftTypesTemplateId
    );
  };

  const setDefaultValues = () => {
    setName("");
    setAbbreviation("");
    setPriority(1);
    setShiftTypesTemplateId(1);
    setIsButtonDisabled(true);
  };

  const save = async () => {
    const isValid = isInputFieldsAreValid();
    if (isValid) {
      setIsSaving(true);
      const location: Location = {
        id: 0,
        name,
        abbreviation,
        priority,
        shiftTypesTemplate: shiftTypesTemplateId,
      };

      await createLocation({ location })
        .then(() => {
          setShowSuccess(true);
          setDefaultValues();
        })
        .catch((error) => {
          setShowError(true);
          console.log(`CreateLocation not successful because: ${error}`);
        })
        .finally(() => setIsSaving(false));
    }
  };

  return (
    <Form className="Form">
      <h1>Нов обект</h1>
      <Row>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Име"
            value={name}
            onChange={onNameChange}
            hasHelpIcon={false}
            helpButtonTooltip={""}
            isInvalid={isInvalidName}
            errorMessage={"Моля, въведете име"}
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
            isInvalid={isInvalidAbbreviation}
            errorMessage={"Моля, въведете абревиатура"}
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
            isInvalid={isInvalidShiftTypesTemplateId}
            errorMessage={"Моля, изберете тип на смените"}
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
            isInvalid={isInvalidPriority}
            errorMessage={"Моля, въведете число по-голямо от 0"}
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
