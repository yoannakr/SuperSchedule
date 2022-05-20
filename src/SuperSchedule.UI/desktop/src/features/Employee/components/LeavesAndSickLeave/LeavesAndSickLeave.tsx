import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Tab, ListGroup, Nav } from "react-bootstrap";
import { Employee } from "../../../../types";
import { getAllEmployees } from "../../api/getAllEmployees";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import styles from "./LeavesAndSickLeave.module.scss";
import { EmployeeLeavesAndSickLeave } from "./EmployeeLeavesAndSickLeave";

export const LeavesAndSickLeave = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);

  const columns: GridColDef[] = [
    { field: "fromDate", headerName: "От дата", width: 130 },
    { field: "toDate", headerName: "До дата", width: 130 },
    { field: "type", headerName: "Основание", width: 130 },
    { field: "comment", headerName: "Бележка", width: 130 },
  ];

  const rows = [{ id: 1, fromDate: "Snow", toDate: "Jon" }];

  useEffect(() => {
    const getDataAllEmployees = () => {
      getAllEmployees()
        .then((response) => {
          const employees: Employee[] = response.data;
          setEmployees(employees);
        })
        .catch((error) =>
          console.log(`GetAllEmployees not successful because: ${error}`)
        );
    };

    getDataAllEmployees();
  }, []);

  const onFirstNameChange = (firstName: string) => {
    setFirstName(firstName);
  };

  const save = () => {};

  return (
    <div className={styles.List}>
      <Tab.Container id="left-tabs-example" defaultActiveKey="0">
        <Row>
          <Col>
            <ListGroup>
              {employees.map((employee, key) => (
                <ListGroup.Item key={key} action eventKey={employee.id}>
                  {`${employee.firstName} ${employee.middleName} ${employee.lastName}`}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col>
            <Tab.Content>
              {employees.map((employee, key) => (
                <Tab.Pane key={key} eventKey={employee.id}>
                  <EmployeeLeavesAndSickLeave employeeId={employee.id} />
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};
