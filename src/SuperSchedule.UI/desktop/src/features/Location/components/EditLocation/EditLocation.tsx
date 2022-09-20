import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";

import styles from "./EditLocation.module.scss";
import {
  CheckboxField,
  InputField,
  SelectField,
} from "../../../../components/Form";
import { Location } from "../../../../types";
import { SnackBar } from "../../../../components/Snackbar";
import { updateLocation } from "../../api/updateLocation";

type EditLocationOptions = {
  location: Location | undefined;
  onSaveEditedLocation: any;
};

export const EditLocation = (props: EditLocationOptions) => {
  const { location, onSaveEditedLocation } = props;

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
  const [name, setName] = useState<string>(location?.name ?? "");
  const [isInvalidName, setIsInvalidName] = useState<boolean>(false);

  const [abbreviation, setAbbreviation] = useState<string>(
    location?.abbreviation ?? ""
  );
  const [isInvalidAbbreviation, setIsInvalidAbbreviation] =
    useState<boolean>(false);

  const [priority, setPriority] = useState<number>(location?.priority ?? 1);
  const [isInvalidPriority, setIsInvalidPriority] = useState<boolean>(false);

  const [shiftTypesTemplateId, setShiftTypesTemplateId] = useState<number>(
    location?.shiftTypesTemplate ?? 1
  );
  const [isInvalidShiftTypesTemplateId, setIsInvalidShiftTypesTemplateId] =
    useState<boolean>(false);

  const [isAutomationFill, setIsAutomationFill] = useState<boolean>(
    location?.isAutomationFill ?? true
  );

  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    onSaveEditedLocation.current = save;
  }, [name, abbreviation, priority, shiftTypesTemplateId]);

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

  const onShiftTypesTemplateIdChange = (shiftTypeTemplateIdInput: string) => {
    setShiftTypesTemplateId(+shiftTypeTemplateIdInput);
    validateShiftTypesTemplateId(+shiftTypeTemplateIdInput);
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

  const save = async (): Promise<boolean> => {
    let isValid = isInputFieldsAreValid();
    if (isValid) {
      const editedLocation: Location = {
        id: location?.id ?? 0,
        name,
        abbreviation,
        priority,
        shiftTypesTemplate: shiftTypesTemplateId,
        isAutomationFill: isAutomationFill,
      };

      if (location !== undefined) {
        location.name = name;
        location.abbreviation = abbreviation;
        location.priority = priority;
        location.shiftTypesTemplate = shiftTypesTemplateId;
      }

      await updateLocation({ location: editedLocation }).catch((error) => {
        isValid = false;
        setShowError(true);
        console.log(`UpdateLocation not successful because: ${error}`);
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

      <Row className={styles.Row}>
        <Form.Group as={Col} controlId="formBasicCheckbox">
          <CheckboxField
            label="Автоматично попълване"
            value={1}
            isChecked={isAutomationFill}
            onChange={() => setIsAutomationFill(!isAutomationFill)}
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
