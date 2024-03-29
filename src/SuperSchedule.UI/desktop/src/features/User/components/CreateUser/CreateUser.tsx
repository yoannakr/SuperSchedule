import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import SaveIcon from "@mui/icons-material/Save";

import styles from "./CreateUser.module.scss";
import { User } from "../../../../types";
import { InputField, SelectField } from "../../../../components/Form";
import { createUser } from "../../api/createUser";
import { SnackBar } from "../../../../components/Snackbar";
import { LoadingButton } from "../../../../components/Button";

export const CreateUser = () => {
  const roles = [
    {
      id: 1,
      name: "Администратор",
    },
    {
      id: 2,
      name: "Редактор",
    },
  ];
  const [username, setUsername] = useState<string>("");
  const [isInvalidUsername, setIsInvalidUsername] = useState<boolean>(false);

  const [password, setPassword] = useState<string>("");
  const [isInvalidPassword, setIsInvalidPassword] = useState<boolean>(false);

  const [roleId, setRoleId] = useState<number>(1);
  const [isInvalidRoleId, setIsInvalidRoleId] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const onUsernameChange = (name: string) => {
    setUsername(name);
    validateUsername(name);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const validateUsername = (nameInput: string): boolean => {
    setIsInvalidUsername(false);
    const nameWithoutNamespaces: string = nameInput.trimEnd().trimStart();

    if (nameWithoutNamespaces.length === 0) {
      setIsInvalidUsername(true);
      return false;
    }

    return true;
  };

  const onPasswordChange = (password: string) => {
    setPassword(password);
    validatePassword(password);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const validatePassword = (passwordInput: string): boolean => {
    setIsInvalidPassword(false);
    const abbreviationWithoutNamespaces: string = passwordInput
      .trimEnd()
      .trimStart();

    if (abbreviationWithoutNamespaces.length === 0) {
      setIsInvalidPassword(true);
      return false;
    }

    return true;
  };

  const onRoleIdChange = (roleIdInput: string) => {
    setRoleId(+roleIdInput);
    validateRoleId(+roleIdInput);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const validateRoleId = (numberInput: number): boolean => {
    setIsInvalidRoleId(false);

    if (numberInput <= 0) {
      setIsInvalidRoleId(true);
      return false;
    }

    return true;
  };

  const isInputFieldsAreValid = (): boolean => {
    const isValidUsername: boolean = validateUsername(username);
    const isValidPassword: boolean = validatePassword(password);
    const isValidRoleId: boolean = validateRoleId(roleId);

    return isValidUsername && isValidPassword && isValidRoleId;
  };

  const setDefaultValues = () => {
    setUsername("");
    setPassword("");
    setRoleId(1);
    setIsButtonDisabled(true);
  };

  const save = async () => {
    const isValid = isInputFieldsAreValid();
    if (isValid) {
      setIsSaving(true);
      const user: User = {
        id: 0,
        username: username,
        password: password,
        role: roleId,
      };

      await createUser({ user })
        .then(() => {
          setShowSuccess(true);
          setDefaultValues();
        })
        .catch((error) => {
          setShowError(true);
          console.log(`CreateUser not successful because: ${error}`);
        })
        .finally(() => setIsSaving(false));
    }
  };

  return (
    <Form className={styles.Form}>
      <h1>Нов потребител</h1>
      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Потребителско име"
            value={username}
            onChange={onUsernameChange}
            hasHelpIcon={false}
            helpButtonTooltip={""}
            isInvalid={isInvalidUsername}
            errorMessage={"Моля, въведете потребителско име"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <InputField
            type="password"
            label="Парола"
            value={password}
            onChange={onPasswordChange}
            hasHelpIcon={false}
            helpButtonTooltip={""}
            isInvalid={isInvalidPassword}
            errorMessage={"Моля, въведете парола"}
          />
        </Form.Group>
      </Row>

      <Row className={styles.Row}>
        <Form.Group as={Col}>
          <SelectField
            label="Потребителска роля"
            ariaLabel="Изберете роля за потребителя:"
            value={roleId}
            onChange={onRoleIdChange}
            options={roles.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
            isInvalid={isInvalidRoleId}
            errorMessage={"Моля, изберете потребителска роля"}
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
