import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { GridRowId, GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import styles from "./EmployeeList.module.scss";
import { deleteEmployee } from "../../api/employee/deleteEmployee";
import { Dialog } from "../../../../components/Dialog";
import { getAllCurrentEmployees } from "../../api/employee/getAllCurrentEmployees";
import { EditEmployee } from "../EditEmployee/EditEmployee";
import { Position, Location, ShiftType, Employee } from "../../../../types";
import { getPositions } from "../../../../api/getPositions";
import { getLocations } from "../../../../api/getLocations";
import { getShiftTypes } from "../../../../api/getShiftTypes";
import { SnackBar } from "../../../../components/Snackbar";
import { UndrawNoEmployeesSvg } from "../../../../components/Svgs";
import { DataGrid } from "../../../../components/DataGrid";
import { getAllEmployees } from "../../api/employee/getAllEmployees";

export const EmployeeList = () => {
  const [currentEmployees, setCurrentEmployees] = useState<Employee[]>([]);
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

  const onSaveEditedEmployee = useRef((): boolean => {
    return false;
  });

  useEffect(() => {
    const getDataAllCurrentEmployees = () => {
      getAllCurrentEmployees()
        .then((response) => {
          const employees: Employee[] = response.data;
          setCurrentEmployees(employees);
        })
        .catch((error) =>
          console.log(`GetAllCurrentEmployees not successful because: ${error}`)
        );
    };

    const getDataAllEmployees = () => {
      getAllEmployees()
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
    getDataAllCurrentEmployees();
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
    setCurrentEmployees((prevEmployees) =>
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
            employees={employees}
          />
        }
        setShowDialog={setShowEditDialog}
        dialogTitle={"Редакция"}
        onAccept={() => {
          const isValid = onSaveEditedEmployee.current();
          if (isValid) {
            setShowEditDialog(false);
            setShowSuccessEditing(true);
          }
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
      {currentEmployees.length !== 0 ? (
        <DataGrid
          className={styles.DataGrid}
          columns={columns}
          rows={currentEmployees}
        />
      ) : (
        <div className={styles.NoEmployees}>
          <UndrawNoEmployeesSvg />
          <h5>Няма съществуващи служители</h5>
        </div>
      )}
    </div>
  );
};
