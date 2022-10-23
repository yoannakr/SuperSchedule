import moment from "moment";
import { axios } from "../../../lib/axios";
import { ManualSchedule } from "../../../types";

type CreateManualScheduleOptions = {
  manualSchedule: ManualSchedule;
};

export const createManualSchedule = ({
  manualSchedule,
}: CreateManualScheduleOptions) => {
  const dateString = moment(manualSchedule.date).format("YYYY-MM-DD");
  return axios.post("/schedule/CreateManualSchedule", {
    locationId: manualSchedule.locationId,
    employeeId: manualSchedule.employeeId,
    shiftTypeId: manualSchedule.shiftTypeId,
    removedShiftTypeId: manualSchedule.removedShiftTypeId,
    date: dateString,
    lastRotationDays: manualSchedule.lastRotationDays,
    dayOfWeekTemplate: manualSchedule.dayOfWeekTemplate,
  });
};
