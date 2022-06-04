import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";

import styles from "./EditPosition.module.scss";
import { InputField } from "../../../../components/Form";
import { Position } from "../../../../types";
import { SnackBar } from "../../../../components/Snackbar";
import { updatePosition } from "../../api/updatePosition";

type EditPositionOptions = {
  position: Position | undefined;
  onSaveEditedPosition: any;
};

export const EditPosition = (props: EditPositionOptions) => {
  const { position, onSaveEditedPosition } = props;

  const [name, setName] = useState<string>(position?.name ?? "");
  const [isInvalidName, setIsInvalidName] = useState<boolean>(false);

  const [abbreviation, setAbbreviation] = useState<string>(
    position?.abbreviation ?? ""
  );
  const [isInvalidAbbreviation, setIsInvalidAbbreviation] =
    useState<boolean>(false);

  const [priority, setPriority] = useState<number>(1);
  const [isInvalidPriority, setIsInvalidPriority] = useState<boolean>(false);

  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    onSaveEditedPosition.current = save;
  }, [name, abbreviation, priority]);

  const onNameChange = (name: string) => {
    setName(name);
    validateName(name);
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
  };

  const validatePriority = (numberInput: number): boolean => {
    setIsInvalidPriority(false);

    if (numberInput <= 0) {
      setIsInvalidPriority(true);
      return false;
    }

    return true;
  };

  const isInputFieldsAreValid = (): boolean => {
    const isValidName: boolean = validateName(name);
    const isValidAbbreviation: boolean = validateAbbreviation(abbreviation);
    const isValidPriority: boolean = validatePriority(priority);

    return isValidName && isValidAbbreviation && isValidPriority;
  };

  const save = async (): Promise<boolean> => {
    let isValid = isInputFieldsAreValid();
    if (isValid) {
      const editedPosition: Position = {
        id: position?.id ?? 0,
        name,
        abbreviation,
        priority,
      };

      if (position !== undefined) {
        position.name = name;
        position.abbreviation = abbreviation;
        position.priority = priority;
      }

      await updatePosition({ position: editedPosition }).catch((error) => {
        isValid = false;
        setShowError(true);
        console.log(`UpdatePosition not successful because: ${error}`);
      });
    }

    return isValid;
  };

  return (
    <Form className={styles.Form}>
      <Row className={styles.Row}>
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

      <Row className={styles.Row}>
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
              "Приоритетът е определящ за създаването на графика."
            }
            isInvalid={isInvalidPriority}
            errorMessage={"Моля, въведете число по-голямо от 0"}
          />
        </Form.Group>
      </Row>

      <SnackBar
        isOpen={showError}
        messages={["Моля, проверете връзката с интернет."]}
        setIsOpen={setShowError}
        severity={"error"}
        alertTitle={"Неуспешна редакция!"}
      />
    </Form>
  );
};
