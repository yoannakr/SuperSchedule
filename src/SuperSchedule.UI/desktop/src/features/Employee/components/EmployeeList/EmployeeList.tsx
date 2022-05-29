import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  DataGrid,
  GridRowId,
  bgBG,
  GridActionsCellItem,
  GridColumns,
} from "@mui/x-data-grid";
import { bgBG as coreBgBG } from "@mui/material/locale";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import styles from "./EmployeeList.module.scss";
import { deleteEmployee } from "../../api/deleteEmployee";
import { Dialog } from "../../../../components/Dialog";
import { getAllCurrentEmployees } from "../../api/getAllCurrentEmployees";
import { EditEmployee } from "../EditEmployee/EditEmployee";
import { Position, Location, ShiftType, Employee } from "../../../../types";
import { getPositions } from "../../../../api/getPositions";
import { getLocations } from "../../../../api/getLocations";
import { getShiftTypes } from "../../../../api/getShiftTypes";
import { SnackBar } from "../../../../components/Snackbar";
import { UndrawNoEmployeesSvg } from "../../../../components/Svgs";

export const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [employee, setEmployee] = useState<Employee>();
  const [employeeId, setEmployeeId] = useState<number>(0);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showSuccessEditing, setShowSuccessEditing] = useState<boolean>(false);
  const [showSuccessDeleted, setShowSuccessDeleted] = useState<boolean>(false);

  const onSaveEditedEmployee = useRef(() => {});

  useEffect(() => {
    const getDataAllEmployees = () => {
      getAllCurrentEmployees()
        .then((response) => {
          const employees: Employee[] = response.data;
          setEmployees(employees);
        })
        .catch((error) =>
          console.log(`GetAllCurrentEmployees not successful because: ${error}`)
        );
    };

    const getDataPositions = () => {
      getPositions()
        .then((response) => {
          const positions: Position[] = response.data;
          setPositions(positions);
        })
        .catch((error) =>
          console.log(`GetAllPositions not successful because: ${error}`)
        );
    };

    const getDataLocations = () => {
      getLocations()
        .then((response) => {
          const locations: Location[] = response.data;
          setLocations(locations);
        })
        .catch((error) =>
          console.log(`GetAllLocations not successful because: ${error}`)
        );
    };

    const getDataShiftTypes = () => {
      getShiftTypes()
        .then((response) => {
          const shiftTypes: ShiftType[] = response.data;
          setShiftTypes(shiftTypes);
        })
        .catch((error) =>
          console.log(`GetAllShiftTypes not successful because: ${error}`)
        );
    };

    getDataPositions();
    getDataLocations();
    getDataShiftTypes();
    getDataAllEmployees();
  }, []);

  const onShowDeleteAlertMessage = useCallback(
    (id: GridRowId, row: Employee) => () => {
      setEmployeeId(+id);
      setEmployeeName(row.fullName ?? row.firstName);
      setShowDeleteAlert(true);
    },
    []
  );

  const onShowEditDialog = useCallback(
    (id: GridRowId, row: Employee) => () => {
      setEmployeeId(+id);
      setEmployee(row);
      setEmployeeName(row.fullName ?? row.firstName);
      setShowEditDialog(true);
    },
    []
  );

  const deleteDataEmployee = () => {
    deleteEmployee({ employeeId }).then(() => {});
    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.id !== employeeId)
    );
    setShowDeleteAlert(false);
    setShowSuccessDeleted(true);
  };

  const columns = useMemo<GridColumns<Employee>>(
    () => [
      { field: "firstName", type: "string", headerName: "Име", flex: 1 },
      { field: "middleName", type: "string", headerName: "Презиме", flex: 1 },
      { field: "lastName", type: "string", headerName: "Фамилия", flex: 1 },
      {
        field: "vacationDays",
        type: "string",
        headerName: "Дни отпуска",
        flex: 1,
      },
      {
        field: "positionName",
        type: "string",
        headerName: "Позиция",
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        width: 80,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Редактирай"
            onClick={onShowEditDialog(params.id, params.row)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Изтрий"
            onClick={onShowDeleteAlertMessage(params.id, params.row)}
          />,
        ],
      },
    ],
    [onShowEditDialog, onShowDeleteAlertMessage]
  );

  const theme = createTheme(
    {
      palette: {
        primary: { main: "#1976d2" },
      },
    },
    bgBG, // x-data-grid translations
    coreBgBG // core translations
  );

  return (
    <div className={styles.List}>
      <Dialog
        showDialog={showDeleteAlert}
        dialogContent={`Сигурни ли сте, че искате да изтриете служителя ${employeeName}?`}
        setShowDialog={setShowDeleteAlert}
        dialogTitle={"Внимание"}
        onAccept={deleteDataEmployee}
        acceptMessage={"Да"}
        cancelMessage={"Не"}
      />

      <Dialog
        className="MuiDialog-paper"
        showDialog={showEditDialog}
        dialogContent={
          <EditEmployee
            employee={employee}
            onSaveEditedEmployee={onSaveEditedEmployee}
            locations={locations}
            positions={positions}
            shiftTypes={shiftTypes}
          />
        }
        setShowDialog={setShowEditDialog}
        dialogTitle={"Редакция"}
        onAccept={() => {
          onSaveEditedEmployee.current();
          setShowEditDialog(false);
          setShowSuccessEditing(true);
        }}
        acceptMessage={"Запис"}
        cancelMessage={"Отказ"}
      />

      <SnackBar
        isOpen={showSuccessEditing}
        messages={["Успешно редактиране!"]}
        setIsOpen={setShowSuccessEditing}
        severity={"success"}
        alertTitle={""}
      />

      <SnackBar
        isOpen={showSuccessDeleted}
        messages={[`${employeeName} е успешно премахнат.`]}
        setIsOpen={setShowSuccessDeleted}
        severity={"success"}
        alertTitle={"Успешно изтриване!"}
      />
      {employees.length !== 0 ? (
        <ThemeProvider theme={theme}>
          <DataGrid
            className={styles.DataGrid}
            columns={columns}
            rows={employees}
          />
        </ThemeProvider>
      ) : (
        <div className={styles.NoEmployees}>
          <UndrawNoEmployeesSvg />
          <h5>Няма съществуващи служители</h5>
        </div>
      )}
    </div>
  );
};
