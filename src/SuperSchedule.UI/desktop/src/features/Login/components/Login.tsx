import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import SaveIcon from "@mui/icons-material/Save";

import "../../../App.css";
import { InputField } from "../../../components/Form";
import { login } from "../api/login";
import { SnackBar } from "../../../components/Snackbar";
import { LoadingButton } from "../../../components/Button";

type LoginOptions = {
  onSuccessfulLogin: any;
};

export const Login = (props: LoginOptions) => {
  const { onSuccessfulLogin } = props;

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [showNoConnectionError, setShowNoConnectionError] =
    useState<boolean>(false);

  const onUsernameChange = (username: string) => {
    setUsername(username);
  };

  const onPasswordChange = (password: string) => {
    setPassword(password);
  };

  const onLogin = () => {
    setIsSaving(true);
    login({ username, password })
      .then((response) => {
        const isAdmin = response.data;
        onSuccessfulLogin(isAdmin);
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          setShowErrorMessage(true);
        } else {
          setShowNoConnectionError(true);
        }
      })
      .finally(() => setIsSaving(false));
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
      <SnackBar
        isOpen={showNoConnectionError}
        messages={["Моля, проверете връзката с интернет."]}
        setIsOpen={setShowNoConnectionError}
        severity={"error"}
        alertTitle={"Неуспешно влизане!"}
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
            disabled={isSaving}
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
            disabled={isSaving}
          />
        </Form.Group>
      </Row>

      <LoadingButton
        onClick={onLogin}
        loading={isSaving}
        icon={<SaveIcon />}
        content={"Вход"}
      />
    </Form>
  );
};
