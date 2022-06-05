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

import styles from "./PositionList.module.scss";
import { Dialog } from "../../../../components/Dialog";
import { Position } from "../../../../types";
import { SnackBar } from "../../../../components/Snackbar";
import { DataGrid } from "../../../../components/DataGrid";
import { EditPosition } from "../EditPosition/EditPosition";
import { deletePosition } from "../../api/deletePosition";
import { UndrawNoPositionsSvg } from "../../../../components/Svgs";
import { getAllCurrentPositions } from "../../api/getAllCurrentPostions";

export const PositionList = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position>();
  const [positionId, setShiftTypeId] = useState<number>(0);
  const [positionName, setShiftTypeName] = useState<string>("");
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showSuccessEditing, setShowSuccessEditing] = useState<boolean>(false);
  const [showSuccessDeleted, setShowSuccessDeleted] = useState<boolean>(false);

  const onSaveEditedPosition = useRef(async (): Promise<boolean> => {
    return false;
  });

  const getDataAllPositions = () => {
    getAllCurrentPositions()
      .then((response) => {
        const positions: Position[] = response.data;
        setPositions(positions);
      })
      .catch((error) =>
        console.log(`GetAllCurrentShiftTypes not successful because: ${error}`)
      );
  };

  useEffect(() => {
    getDataAllPositions();
  }, [showSuccessEditing]);

  const onShowDeleteAlertMessage = useCallback(
    (id: GridRowId, row: Position) => () => {
      setShiftTypeId(+id);
      setShiftTypeName(row.name);
      setShowDeleteAlert(true);
    },
    []
  );

  const onShowEditDialog = useCallback(
    (id: GridRowId, row: Position) => () => {
      setShiftTypeId(+id);
      setSelectedPosition(row);
      setShiftTypeName(row.name);
      setShowEditDialog(true);
    },
    []
  );

  const deleteDataPosition = () => {
    deletePosition({ positionId }).then(() => {});
    setPositions((prevPositions) =>
      prevPositions.filter((position) => position.id !== positionId)
    );
    setShowDeleteAlert(false);
    setShowSuccessDeleted(true);
  };

  const columns = useMemo<GridColumns<Position>>(
    () => [
      { field: "name", type: "string", headerName: "Име", flex: 1 },
      {
        field: "abbreviation",
        type: "string",
        headerName: "Абревиатура",
        flex: 1,
      },
      {
        field: "priority",
        type: "string",
        headerName: "Приоритет",
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
        dialogContent={`Сигурни ли сте, че искате да изтриете позиция ${positionName}?`}
        setShowDialog={setShowDeleteAlert}
        dialogTitle={"Внимание"}
        onAccept={deleteDataPosition}
        acceptMessage={"Да"}
        cancelMessage={"Не"}
      />

      <Dialog
        className="MuiDialog-paper"
        showDialog={showEditDialog}
        dialogContent={
          <EditPosition
            position={selectedPosition}
            onSaveEditedPosition={onSaveEditedPosition}
          />
        }
        setShowDialog={setShowEditDialog}
        dialogTitle={"Редакция"}
        onAccept={async () => {
          const isValid: boolean = await onSaveEditedPosition.current();
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
        messages={[`${positionName} е успешно премахнатa.`]}
        setIsOpen={setShowSuccessDeleted}
        severity={"success"}
        alertTitle={"Успешно изтриване!"}
      />
      {positions.length !== 0 ? (
        <DataGrid
          className={styles.DataGrid}
          columns={columns}
          rows={positions}
        />
      ) : (
        <div className={styles.NoPositions}>
          <UndrawNoPositionsSvg />
          <h5>Няма съществуващи позиции</h5>
        </div>
      )}
    </div>
  );
};
