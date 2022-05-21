import React, { useEffect, useState } from "react";
import { Form, Row, Col, Table, Button } from "react-bootstrap";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import "../../../App.css";
import styles from "./Setting.module.scss";
import { IconButton, Input } from "@material-ui/core";
import moment from "moment";
import { getSettings } from "../api/getSettings";
import { updateSetting } from "../api/updateSetting";

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

  useEffect(() => {
    const getDataSettings = () => {
      getSettings()
        .then((response) => {
          const setting: Setting = response.data;
          setSetting(setting);
          let holidays: Holiday[] = [];
          setting.holidays.map((holiday) => {
            const test: Holiday = {
              id: holiday.id,
              name: holiday.name,
              date: moment(holiday.date).format("YYYY-MM-DD"),
            };
            holidays.push(test);
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
  };

  const onDeleteHoliday = (holiday: Holiday) => {
    const newHolidays = holidays.filter((h) => h !== holiday);
    setHolidays(newHolidays);
  };

  const onNameChange = (name: string, holiday: Holiday) => {
    const index = holidays.indexOf(holiday);
    const items = [...holidays];
    const item = { ...items[index] };

    item.name = name;
    items[index] = item;
    setHolidays(items);
  };

  const onDateChange = (date: string, holiday: Holiday) => {
    const index = holidays.indexOf(holiday);
    const items = [...holidays];
    const item = { ...items[index] };

    item.date = moment(date).format("YYYY-MM-DD");
    items[index] = item;
    setHolidays(items);
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
  };

  const save = () => {
    if (setting != undefined) {
      setting.holidays = holidays;
    }

    updateSetting({ setting }).catch((error) =>
      console.log(`UpdateSetting not successful because: ${error}`)
    );
  };

  return (
    <Form className="Form">
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
                    <Form.Control
                      type="date"
                      value={holiday.date}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onDateChange(e.currentTarget.value, holiday)
                      }
                    />
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
      <Button className="mt-4" variant="primary" onClick={save}>
        Запис
      </Button>
    </Form>
  );
};
