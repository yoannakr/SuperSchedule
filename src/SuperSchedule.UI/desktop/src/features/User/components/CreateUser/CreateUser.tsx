import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { User } from "../../../../types";

import "../../../../App.css";
import { InputField, SelectField } from "../../../../components/Form";
import { createUser } from "../../api/createUser";

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
  const [password, setPassword] = useState<string>("");
  const [roleId, setRoleId] = useState<number>(1);

  const onUsernameChange = (username: string) => {
    setUsername(username);
  };

  const onPasswordChange = (password: string) => {
    setPassword(password);
  };

  const onRoleIdChange = (roleIdInput: string) => {
    setRoleId(+roleIdInput);
  };

  const save = () => {
    const user: User = {
      id: 0,
      username: username,
      password: password,
      role: roleId,
    };

    createUser({ user }).catch((error) =>
      console.log(`CreateUser not successful because: ${error}`)
    );
  };

  return (
    <Form className="Form">
      <h1>Нов потребител</h1>
      <Row>
        <Form.Group as={Col}>
          <InputField
            type="text"
            label="Потребителско име"
            value={username}
            onChange={onUsernameChange}
            hasHelpIcon={false}
            helpButtonTooltip={""}
          />
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <InputField
            type="password"
            label="Парола"
            value={password}
            onChange={onPasswordChange}
            hasHelpIcon={false}
            helpButtonTooltip={""}
          />
        </Form.Group>
      </Row>

      <Row>
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
          />
        </Form.Group>
      </Row>

      <Button className="mt-4" variant="primary" onClick={save}>
        Запис
      </Button>
    </Form>
  );
};
