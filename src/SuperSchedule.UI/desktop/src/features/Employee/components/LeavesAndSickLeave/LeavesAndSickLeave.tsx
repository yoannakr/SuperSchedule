import React, { useState, useEffect } from "react";
import { Row, Col, Tab, ListGroup } from "react-bootstrap";
import { Employee } from "../../../../types";

import "../../../../App.css";
import styles from "./LeavesAndSickLeave.module.scss";
import { EmployeeLeavesAndSickLeave } from "./EmployeeLeavesAndSickLeave";
import { UndrawNoEmployeesSvg } from "../../../../components/Svgs";
import Box from "@material-ui/core/Box";
import Skeleton from "@mui/lab/Skeleton";
import { getAllCurrentEmployees } from "../../api/employee/getAllCurrentEmployees";

export const LeavesAndSickLeave = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getDataAllEmployees = () => {
      setIsLoading(true);
      getAllCurrentEmployees()
        .then((response) => {
          const employees: Employee[] = response.data;
          setEmployees(employees);
        })
        .catch((error) =>
          console.log(`GetAllEmployees not successful because: ${error}`)
        )
        .finally(() => {
          setTimeout(() => setIsLoading(false), 1000);
        });
    };

    getDataAllEmployees();
  }, []);

  return (
    <div className={styles.Container}>
      {isLoading && (
        <div className={styles.Loading}>
          <Box className={styles.LoadingLines}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
          </Box>
        </div>
      )}
      {!isLoading &&
        (employees.length !== 0 ? (
          <div className={styles.List}>
            <Tab.Container
              id="left-tabs-example"
              defaultActiveKey={employees[0].id}
            >
              <Row className={styles.ListGroupContainer}>
                <Col xs={4} md={3}>
                  <ListGroup className={styles.ListGroup}>
                    {employees.map((employee, key) => (
                      <ListGroup.Item key={key} action eventKey={employee.id}>
                        {`${employee.firstName} ${employee.middleName} ${employee.lastName}`}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
                <Col xs={12} md={9}>
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
        ) : (
          <div className={styles.NoEmployees}>
            <UndrawNoEmployeesSvg />
            <h5>Няма съществуващи служители</h5>
          </div>
        ))}
    </div>
  );
};
