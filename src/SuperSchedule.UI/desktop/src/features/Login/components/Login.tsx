import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

import "../../../App.css";
import { InputField } from "../../../components/Form";
import { login } from "../api/login";
import { SnackBar } from "../../../components/Snackbar";

type LoginOptions = {
  onSuccessfulLogin: any;
};

export const Login = (props: LoginOptions) => {
  const { onSuccessfulLogin } = props;

  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowErrorMessage(false);
  };

  const onUsernameChange = (username: string) => {
    setUsername(username);
  };

  const onPasswordChange = (password: string) => {
    setPassword(password);
  };

  const onLogin = () => {
    login({ username, password })
      .then((response) => {
        const isAdmin = response.data;
        onSuccessfulLogin(isAdmin);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setShowErrorMessage(true);
        }
      });
  };

  return (
    <Form className="Login">
      <SnackBar
        isOpen={showErrorMessage}
        messages={["Грешно потребителско име и/или парола!"]}
        setIsOpen={setShowErrorMessage}
        severity={"error"}
        alertTitle={"Неуспешно влизане"}
      />
      <h1>Вход</h1>
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

      <Button className="mt-4" variant="primary" onClick={onLogin}>
        Запис
      </Button>
    </Form>
  );
};
