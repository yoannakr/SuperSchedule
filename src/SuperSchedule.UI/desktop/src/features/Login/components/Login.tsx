import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import "../../../App.css";
import { InputField } from "../../../components/Form";
import { login } from "../api/login";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
      <Snackbar
        open={showErrorMessage}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          <AlertTitle>Неуспешно влизане</AlertTitle>
          Грешно потребителско име и/или парола!
        </Alert>
      </Snackbar>
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
