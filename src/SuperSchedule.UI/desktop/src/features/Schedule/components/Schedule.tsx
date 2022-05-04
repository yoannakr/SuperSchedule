import React, { useEffect, useState } from "react";
import EditIcon from "@material-ui/icons/EditOutlined";
import { getLocations } from "../../../api/getLocations";
import { Location } from "../../../types";
import { IconButton } from "@material-ui/core";
import { Tab, Tabs } from "react-bootstrap";
import { LocationSchedule } from "./LocationSchedule";
import styles from "./Schedule.module.scss";

export const Schedule = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

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

    getDataLocations();
  }, []);

  const onEditModeChange = () => {
    setIsEditMode(!isEditMode);
    onSave();
  };

  const onSave = () => {
    // let allShiftTypeEditableCells: ShiftTypeEditableCell[] = [];
    // schedulesRows.map(
    //   (scheduleRow) =>
    //     (allShiftTypeEditableCells = allShiftTypeEditableCells.concat(
    //       scheduleRow.shiftTypeEditableCells
    //     ))
    // );
    // console.log(allShiftTypeEditableCells);
    // updateShiftTypeOfSchedules({
    //   shiftTypeEditableCells: allShiftTypeEditableCells,
    // });
  };

  return (
    <div className={styles.Schedule}>
      <IconButton aria-label="delete" onClick={onEditModeChange}>
        <EditIcon />
      </IconButton>
      {locations.length !== 0 && (
        <Tabs defaultActiveKey={locations[0].id} transition={false}>
          {locations.map((location, key) => (
            <Tab key={key} eventKey={location.id} title={location.name}>
              <LocationSchedule locationId={location.id} />
            </Tab>
          ))}
        </Tabs>
      )}
    </div>
  );
};
