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

import styles from "./ShiftTypeList.module.scss";
import { deleteShiftType } from "../../api/deleteShiftType";
import { Dialog } from "../../../../components/Dialog";
import { getAllCurrentShiftTypes } from "../../api/getAllCurrentShiftTypes";
import { EditShiftType } from "../EditShiftType/EditShiftType";
import { Location, ShiftType, Day } from "../../../../types";
import { getLocations } from "../../../../api/getLocations";
import { SnackBar } from "../../../../components/Snackbar";
import { DataGrid } from "../../../../components/DataGrid";
import { UndrawNoShiftTypesSvg } from "../../../../components/Svgs/UndrawNoShiftTypesSvg";
import { getDays } from "../../../../api/getDays";
import moment from "moment";
import { isShiftTypeDefaultType } from "../../../../utils";

type ShiftTypeRow = {
  id: number;
  name: string;
  abbreviation: string;
  startTime?: moment.Moment;
  startTimeFormatted: string;
  endTime?: moment.Moment;
  endTimeFormatted: string;
  rotationDays?: number;
  priority?: number;
  isDeleted?: boolean;
  locationId?: number;
  nightHours?: number;
  daysIds?: number[];
};

export const ShiftTypeList = () => {
  const timeFormat = "HH:mm";

  const [shiftTypes, setShiftTypes] = useState<ShiftTypeRow[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [days, setDays] = useState<Day[]>([]);
  const [selectedShiftType, setSelectedShiftType] = useState<ShiftTypeRow>();
  const [shiftTypeId, setShiftTypeId] = useState<number>(0);
  const [shiftTypeName, setShiftTypeName] = useState<string>("");
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showSuccessEditing, setShowSuccessEditing] = useState<boolean>(false);
  const [showSuccessDeleted, setShowSuccessDeleted] = useState<boolean>(false);

  const onSaveEditedShiftType = useRef(async (): Promise<boolean> => {
    return false;
  });

  const getDataAllShiftTypes = () => {
    getAllCurrentShiftTypes()
      .then((response) => {
        const shiftTypes: ShiftType[] = response.data;
        const shiftTypeRows: ShiftTypeRow[] = shiftTypes.map((shiftType) => ({
          id: shiftType.id,
          name: shiftType.name,
          abbreviation: shiftType.abbreviation,
          startTime: shiftType.startTime,
          startTimeFormatted:
            moment(shiftType.startTime)?.format(timeFormat) ?? "",
          endTime: shiftType.endTime,
          endTimeFormatted: moment(shiftType.endTime)?.format(timeFormat) ?? "",
          rotationDays: shiftType.rotationDays,
          priority: shiftType.priority,
          locationId: shiftType.locationId,
          nightHours: shiftType.nightHours,
          daysIds: shiftType.daysIds,
        }));
        setShiftTypes(shiftTypeRows);
      })
      .catch((error) =>
        console.log(`GetAllCurrentShiftTypes not successful because: ${error}`)
      );
  };

  useEffect(() => {
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

    const getDataAllDays = () => {
      getDays()
        .then((response) => {
          const days: Day[] = response.data;
          setDays(days);
        })
        .catch((error) =>
          console.log(
            `GetAllCurrentShiftTypes not successful because: ${error}`
          )
        );
    };

    getDataAllShiftTypes();
    getDataLocations();
    getDataAllDays();
  }, []);

  const onShowDeleteAlertMessage = useCallback(
    (id: GridRowId, row: ShiftTypeRow) => () => {
      setShiftTypeId(+id);
      setShiftTypeName(row.name);
      setShowDeleteAlert(true);
    },
    []
  );

  useEffect(() => {
    getDataAllShiftTypes();
  }, [showSuccessEditing]);

  const onShowEditDialog = useCallback(
    (id: GridRowId, row: ShiftTypeRow) => () => {
      setShiftTypeId(+id);
      setSelectedShiftType(row);
      setShiftTypeName(row.name);
      setShowEditDialog(true);
    },
    []
  );

  const deleteDataShiftType = () => {
    deleteShiftType({ shiftTypeId }).then(() => {});
    setShiftTypes((prevShiftTypes) =>
      prevShiftTypes.filter((shiftType) => shiftType.id !== shiftTypeId)
    );
    setShowDeleteAlert(false);
    setShowSuccessDeleted(true);
  };

  const columns = useMemo<GridColumns<ShiftTypeRow>>(
    () => [
      { field: "name", type: "string", headerName: "Име", flex: 1 },
      {
        field: "abbreviation",
        type: "string",
        headerName: "Абревиатура",
        flex: 1,
      },
      {
        field: "startTimeFormatted",
        type: "string",
        headerName: "Начало",
        flex: 1,
      },
      {
        field: "endTimeFormatted",
        type: "string",
        headerName: "Край",
        flex: 1,
      },
      {
        field: "rotationDays",
        type: "string",
        headerName: "Дни на редуване",
        flex: 1,
      },
      {
        field: "priority",
        type: "string",
        headerName: "Приоритет",
        flex: 1,
      },
      {
        field: "nightHours",
        type: "string",
        headerName: "Нощни часове",
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        width: 80,
        getActions: (params) => [
          <GridActionsCellItem
            icon={
              <EditIcon
                style={{
                  color: isShiftTypeDefaultType(
                    params.row.locationId,
                    params.row.priority
                  )
                    ? "grey"
                    : "green",
                }}
              />
            }
            label="Редактирай"
            onClick={onShowEditDialog(params.id, params.row)}
            disabled={isShiftTypeDefaultType(
              params.row.locationId,
              params.row.priority
            )}
          />,
          <GridActionsCellItem
            icon={
              <DeleteIcon
                style={{
                  color: isShiftTypeDefaultType(
                    params.row.locationId,
                    params.row.priority
                  )
                    ? "grey"
                    : "red",
                }}
              />
            }
            label="Изтрий"
            onClick={onShowDeleteAlertMessage(params.id, params.row)}
            disabled={isShiftTypeDefaultType(
              params.row.locationId,
              params.row.priority
            )}
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
        dialogContent={`Сигурни ли сте, че искате да изтриете смяна ${shiftTypeName}?`}
        setShowDialog={setShowDeleteAlert}
        dialogTitle={"Внимание"}
        onAccept={deleteDataShiftType}
        acceptMessage={"Да"}
        cancelMessage={"Не"}
      />

      <Dialog
        className="MuiDialog-paper"
        showDialog={showEditDialog}
        dialogContent={
          <EditShiftType
            shiftType={{
              id: selectedShiftType?.id ?? 0,
              name: selectedShiftType?.name ?? "",
              abbreviation: selectedShiftType?.abbreviation ?? "",
              startTime: selectedShiftType?.startTime ?? moment(),
              endTime: selectedShiftType?.endTime ?? moment(),
              rotationDays: selectedShiftType?.rotationDays ?? 1,
              priority: selectedShiftType?.priority ?? 1,
              locationId: selectedShiftType?.locationId ?? 0,
              nightHours: selectedShiftType?.nightHours ?? 0,
              daysIds: selectedShiftType?.daysIds ?? [],
            }}
            onSaveEditedShiftType={onSaveEditedShiftType}
            locations={locations}
            days={days}
          />
        }
        setShowDialog={setShowEditDialog}
        dialogTitle={"Редакция"}
        onAccept={async () => {
          const isValid: boolean = await onSaveEditedShiftType.current();
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
        messages={[`${shiftTypeName} е успешно премахнат.`]}
        setIsOpen={setShowSuccessDeleted}
        severity={"success"}
        alertTitle={"Успешно изтриване!"}
      />
      {shiftTypes.length !== 0 ? (
        <DataGrid
          className={styles.DataGrid}
          columns={columns}
          rows={shiftTypes}
        />
      ) : (
        <div className={styles.NoShiftTypes}>
          <UndrawNoShiftTypesSvg />
          <h5>Няма съществуващи смени</h5>
        </div>
      )}
    </div>
  );
};
