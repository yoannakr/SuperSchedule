import moment from "moment";
import { axios } from "../../../lib/axios";
import { ShiftType } from "../../../types";

type UpdateShiftTypeOptions = {
  shiftType: ShiftType;
};

export const updateShiftType = async ({
  shiftType,
}: UpdateShiftTypeOptions) => {
  const request = {
    id: shiftType.id,
    name: shiftType.name,
    abbreviation: shiftType.abbreviation,
    abbreviationByPassed: shiftType.abbreviationByPassed,
    startTime: `2022-01-01T${shiftType.startTime?.format("HH:mm")}:00.000Z`,
    endTime: `2022-01-01T${shiftType.endTime?.format("HH:mm")}:00.000Z`,
    rotationDays: shiftType.rotationDays,
    priority: shiftType.priority,
    isDeleted: shiftType.isDeleted,
    locationId: shiftType.locationId,
    nightHours: shiftType.nightHours,
    daysIds: shiftType.daysIds,
  };

  await axios.post("/shiftTypes/UpdateShiftType", request);
};
