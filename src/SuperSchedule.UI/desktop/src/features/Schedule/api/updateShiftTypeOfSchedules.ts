import { axios } from "../../../lib/axios";
import { ShiftTypeEditableCell } from "../components/EditScheduleTableCell";
import { LocationScheduleRow } from "../components/LocationSchedule";

type UpdateShiftTypeOfSchedulesOptions = {
  scheduleModels: LocationScheduleRow[];
};

export const updateShiftTypeOfSchedules = ({
  scheduleModels,
}: UpdateShiftTypeOfSchedulesOptions) => {
  return axios.post("/schedule/UpdateShiftTypeOfSchedules", scheduleModels);
};
