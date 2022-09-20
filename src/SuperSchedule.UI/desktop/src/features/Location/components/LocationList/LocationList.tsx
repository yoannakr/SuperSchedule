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

import styles from "./LocationList.module.scss";
import { Dialog } from "../../../../components/Dialog";
import { Location } from "../../../../types";
import { SnackBar } from "../../../../components/Snackbar";
import { DataGrid } from "../../../../components/DataGrid";
import { isShiftTypeDefaultType } from "../../../../utils";
import { deleteLocation } from "../../api/deleteLocation";
import { EditLocation } from "../EditLocation/EditLocation";
import { UndrawNoLocationsSvg } from "../../../../components/Svgs";
import { getAllCurrentLocations } from "../../api/getAllCurrentLocations";

type LocationRow = {
  id: number;
  name: string;
  abbreviation: string;
  priority?: number;
  shiftTypesTemplate: number;
  shiftTypesTemplateName?: string;
  isAutomationFill: boolean;
  isDeleted?: boolean;
};

export const LocationList = () => {
  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationRow>();
  const [locationId, setLocationId] = useState<number>(0);
  const [locationName, setLocationName] = useState<string>("");
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showSuccessEditing, setShowSuccessEditing] = useState<boolean>(false);
  const [showSuccessDeleted, setShowSuccessDeleted] = useState<boolean>(false);

  const onSaveEditedLocation = useRef(async (): Promise<boolean> => {
    return false;
  });

  useEffect(() => {
    const getDataLocations = () => {
      getAllCurrentLocations()
        .then((response) => {
          const locations: Location[] = response.data;
          const locationsRows: LocationRow[] = locations.map((location) => ({
            id: location.id,
            name: location.name,
            abbreviation: location.abbreviation,
            priority: location.priority,
            shiftTypesTemplate: location.shiftTypesTemplate,
            shiftTypesTemplateName: location.shiftTypesTemplateName,
            isAutomationFill: location.isAutomationFill,
          }));
          setLocations(locationsRows);
        })
        .catch((error) =>
          console.log(`GetAllLocations not successful because: ${error}`)
        );
    };
    getDataLocations();
  }, [showSuccessEditing]);

  const onShowDeleteAlertMessage = useCallback(
    (id: GridRowId, row: LocationRow) => () => {
      setLocationId(+id);
      setLocationName(row.name);
      setShowDeleteAlert(true);
    },
    []
  );

  const onShowEditDialog = useCallback(
    (id: GridRowId, row: LocationRow) => () => {
      setLocationId(+id);
      setSelectedLocation(row);
      setLocationName(row.name);
      setShowEditDialog(true);
    },
    []
  );

  const deleteDataLocation = () => {
    deleteLocation({ locationId }).then(() => {});
    setLocations((prevLocations) =>
      prevLocations.filter((location) => location.id !== locationId)
    );
    setShowDeleteAlert(false);
    setShowSuccessDeleted(true);
  };

  const columns = useMemo<GridColumns<LocationRow>>(
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
        field: "shiftTypesTemplateName",
        type: "string",
        headerName: "Тип на смените",
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        width: 80,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon style={{ color: "green" }} />}
            label="Редактирай"
            onClick={onShowEditDialog(params.id, params.row)}
            disabled={isShiftTypeDefaultType(
              params.row.locationId,
              params.row.priority
            )}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon style={{ color: "red" }} />}
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
        dialogContent={`Сигурни ли сте, че искате да изтриете смяна ${locationName}?`}
        setShowDialog={setShowDeleteAlert}
        dialogTitle={"Внимание"}
        onAccept={deleteDataLocation}
        acceptMessage={"Да"}
        cancelMessage={"Не"}
      />

      <Dialog
        className="MuiDialog-paper"
        showDialog={showEditDialog}
        dialogContent={
          <EditLocation
            location={{
              id: selectedLocation?.id ?? 0,
              name: selectedLocation?.name ?? "",
              abbreviation: selectedLocation?.abbreviation ?? "",
              shiftTypesTemplate: selectedLocation?.shiftTypesTemplate ?? 1,
              priority: selectedLocation?.priority ?? 1,
              isAutomationFill: selectedLocation?.isAutomationFill ?? true,
            }}
            onSaveEditedLocation={onSaveEditedLocation}
          />
        }
        setShowDialog={setShowEditDialog}
        dialogTitle={"Редакция"}
        onAccept={async () => {
          const isValid: boolean = await onSaveEditedLocation.current();
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
        messages={[`${locationName} е успешно премахнат.`]}
        setIsOpen={setShowSuccessDeleted}
        severity={"success"}
        alertTitle={"Успешно изтриване!"}
      />
      {locations.length !== 0 ? (
        <DataGrid
          className={styles.DataGrid}
          columns={columns}
          rows={locations}
        />
      ) : (
        <div className={styles.NoLocations}>
          <UndrawNoLocationsSvg />
          <h5>Няма съществуващи обекти</h5>
        </div>
      )}
    </div>
  );
};
