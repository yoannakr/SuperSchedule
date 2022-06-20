import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";

import "../../../App.css";
import styles from "./Login.module.scss";
import { InputField } from "../../../components/Form";
import { login } from "../api/login";
import { SnackBar } from "../../../components/Snackbar";
import { LoadingButton } from "../../../components/Button";
import { LoginSvg } from "./LoginSvg";

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
    <Form className={styles.Login}>
      <div className={styles.Box}>
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
        <div className={styles.LoginImage}>
          <LoginSvg />
        </div>
        <div className={styles.LoginForm}>
          <Row>
            <Form.Group as={Col}>
              <PersonIcon className={styles.Icon} />
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
              <LockIcon className={styles.Icon} />
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
            icon={<LoginIcon />}
            content={"Вход"}
          />
        </div>
      </div>
    </Form>
  );
};
