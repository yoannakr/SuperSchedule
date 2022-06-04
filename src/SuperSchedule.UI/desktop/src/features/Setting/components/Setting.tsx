import React, { useEffect, useState } from "react";
import { Form, Row, Col, Table } from "react-bootstrap";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SaveIcon from "@mui/icons-material/Save";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Box from "@mui/material/Box";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";

import "../../../App.css";
import styles from "./Setting.module.scss";
import { IconButton, Input } from "@material-ui/core";
import moment from "moment";
import { getSettings } from "../api/getSettings";
import { updateSetting } from "../api/updateSetting";
import { SnackBar } from "../../../components/Snackbar";
import { LoadingButton } from "../../../components/Button";

export type Setting = {
  id: number;
  nightWorkRate: number;
  maxHoursPerWeek: number;
  maxOvertimeHoursPerMonth: number;
  maxOvertimeHoursPerYear: number;
  holidays: Holiday[];
};

type Holiday = {
  id: number;
  name: string;
  date: string;
};

export const Setting = () => {
  const defaultSetting: Setting = {
    id: 0,
    nightWorkRate: 0,
    maxHoursPerWeek: 0,
    maxOvertimeHoursPerMonth: 0,
    maxOvertimeHoursPerYear: 0,
    holidays: [
      {
        id: 0,
        name: "",
        date: "",
      },
    ],
  };

  const [setting, setSetting] = useState<Setting>(defaultSetting);
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    const getDataSettings = () => {
      getSettings()
        .then((response) => {
          const setting: Setting = response.data;
          setSetting(setting);
          let holidays: Holiday[] = [];
          setting.holidays.map((holiday) => {
            const holidayModel: Holiday = {
              id: holiday.id,
              name: holiday.name,
              date: moment(holiday.date).format("YYYY-MM-DD"),
            };
            holidays.push(holidayModel);
          });
          setHolidays(holidays);
        })
        .catch((error) =>
          console.log(`GetSettings not successful because: ${error}`)
        );
    };

    getDataSettings();
  }, []);

  const onAddHoliday = () => {
    setHolidays([
      ...holidays,
      { id: 0, name: "", date: moment().format("YYYY-MM-DD") },
    ]);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onDeleteHoliday = (holiday: Holiday) => {
    const newHolidays = holidays.filter((h) => h !== holiday);
    setHolidays(newHolidays);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onNameChange = (name: string, holiday: Holiday) => {
    const index = holidays.indexOf(holiday);
    const items = [...holidays];
    const item = { ...items[index] };

    item.name = name;
    items[index] = item;
    setHolidays(items);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onDateChange = (date: Date | null, holiday: Holiday) => {
    const index = holidays.indexOf(holiday);
    const items = [...holidays];
    const item = { ...items[index] };

    item.date =
      moment(date)?.format("YYYY-MM-DD") ?? moment().format("YYYY-MM-DD");
    items[index] = item;
    setHolidays(items);

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onMaxOvertimeHoursPerYearChange = (maxOvertimeHoursPerYear: string) => {
    const newSetting = setting;
    if (newSetting !== undefined) {
      newSetting.maxOvertimeHoursPerYear = +maxOvertimeHoursPerYear;
      setSetting({
        ...newSetting,
        [maxOvertimeHoursPerYear]: +maxOvertimeHoursPerYear,
      });
    }

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onMaxOvertimeHoursPerMonthChange = (
    maxOvertimeHoursPerMonth: string
  ) => {
    const newSetting = setting;
    if (newSetting !== undefined) {
      newSetting.maxOvertimeHoursPerMonth = +maxOvertimeHoursPerMonth;
      setSetting({
        ...newSetting,
        [maxOvertimeHoursPerMonth]: +maxOvertimeHoursPerMonth,
      });
    }

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onMaxHoursPerWeekChange = (maxHoursPerWeek: string) => {
    const newSetting = setting;
    if (newSetting !== undefined) {
      newSetting.maxHoursPerWeek = +maxHoursPerWeek;
      setSetting({
        ...newSetting,
        [maxHoursPerWeek]: +maxHoursPerWeek,
      });
    }

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const onNightWorkRateChange = (nightWorkRate: string) => {
    const newSetting = setting;
    if (newSetting !== undefined) {
      newSetting.nightWorkRate = +nightWorkRate;
      setSetting({
        ...newSetting,
        [nightWorkRate]: +nightWorkRate,
      });
    }

    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  };

  const save = async () => {
    setIsSaving(true);
    if (setting !== undefined) {
      setting.holidays = holidays;
    }

    await updateSetting({ setting })
      .then(() => {
        setShowSuccess(true);
        setIsButtonDisabled(true);
      })
      .catch((error) => {
        setShowError(true);
        console.log(`UpdateSetting not successful because: ${error}`);
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <Form className={styles.Form}>
      <Form.Group as={Row} className={styles.Row}>
        <Form.Label column>Коефицент на нощен труд:</Form.Label>
        <Col>
          <Form.Control
            type="text"
            value={setting?.nightWorkRate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onNightWorkRateChange(e.currentTarget.value)
            }
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className={styles.Row}>
        <Form.Label column>Максимални часове за седмица:</Form.Label>
        <Col>
          <Form.Control
            type="text"
            value={setting?.maxHoursPerWeek}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onMaxHoursPerWeekChange(e.currentTarget.value)
            }
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className={styles.Row}>
        <Form.Label column>
          Максимални часове извънреден труд на месец:
        </Form.Label>
        <Col>
          <Form.Control
            type="text"
            value={setting?.maxOvertimeHoursPerMonth}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onMaxOvertimeHoursPerMonthChange(e.currentTarget.value)
            }
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className={styles.Row}>
        <Form.Label column>
          Максимални часове извънреден труд за година:
        </Form.Label>
        <Col>
          <Form.Control
            type="text"
            value={setting?.maxOvertimeHoursPerYear}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onMaxOvertimeHoursPerYearChange(e.currentTarget.value)
            }
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className={styles.Row}>
        <Col>
          <Table striped bordered hover>
            <caption>
              <IconButton onClick={onAddHoliday}>
                <AddCircleIcon className={styles.AddButton} />
              </IconButton>
              Официални почивни дни
            </caption>
            <thead>
              <tr>
                <th>Име</th>
                <th>Дата</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday, key) => (
                <tr key={key}>
                  <td>
                    <Form.Control
                      type="text"
                      value={holiday.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onNameChange(e.currentTarget.value, holiday)
                      }
                    />
                  </td>
                  <td>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Box>
                        <DatePicker
                          inputFormat="dd.MM.yyyy"
                          minDate={new Date("2020-01-01")}
                          mask="__.__.____"
                          value={holiday.date}
                          onChange={(date: Date | null) =>
                            onDateChange(date, holiday)
                          }
                          renderInput={(params) => (
                            <TextField {...params} helperText={null} />
                          )}
                        />
                      </Box>
                    </LocalizationProvider>
                  </td>
                  <td>
                    <IconButton onClick={() => onDeleteHoliday(holiday)}>
                      <DeleteForeverIcon className={styles.DeleteButton} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Form.Group>

      <SnackBar
        isOpen={showSuccess}
        messages={["Успешна редакция!"]}
        setIsOpen={setShowSuccess}
        severity={"success"}
        alertTitle={""}
      />

      <SnackBar
        isOpen={showError}
        messages={["Моля, проверете връзката с интернет."]}
        setIsOpen={setShowError}
        severity={"error"}
        alertTitle={"Неуспешна редакция!"}
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
