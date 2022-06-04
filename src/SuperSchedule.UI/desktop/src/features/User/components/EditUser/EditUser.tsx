import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";

import styles from "./EditUser.module.scss";
import { InputField, SelectField } from "../../../../components/Form";
import { User } from "../../../../types";
import { SnackBar } from "../../../../components/Snackbar";
import { updateUser } from "../../api/updateUser";

type EditUserOptions = {
  user: User | undefined;
  onSaveEditedUser: any;
};

export const EditUser = (props: EditUserOptions) => {
  const { user, onSaveEditedUser } = props;

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

  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [isInvalidUsername, setIsInvalidUsername] = useState<boolean>(false);

  const [password, setPassword] = useState<string>(user?.password ?? "");
  const [isInvalidPassword, setIsInvalidPassword] = useState<boolean>(false);

  const [roleId, setRoleId] = useState<number>(user?.role ?? 1);
  const [isInvalidRoleId, setIsInvalidRoleId] = useState<boolean>(false);

  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    onSaveEditedUser.current = save;
  }, [username, password, roleId]);

  const onUsernameChange = (name: string) => {
    setUsername(name);
    validateUsername(name);
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

  const save = async (): Promise<boolean> => {
    let isValid = isInputFieldsAreValid();
    if (isValid) {
      const editedUser: User = {
        id: user?.id ?? 0,
        username,
        password,
        role: roleId,
      };

      if (user !== undefined) {
        user.username = username;
        user.password = password;
        user.role = roleId;
      }

      await updateUser({ user: editedUser }).catch((error) => {
        isValid = false;
        setShowError(true);
        console.log(`UpdateUser not successful because: ${error}`);
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
        isOpen={showError}
        messages={["Моля, проверете връзката с интернет."]}
        setIsOpen={setShowError}
        severity={"error"}
        alertTitle={"Неуспешна редакция!"}
      />
    </Form>
  );
};
