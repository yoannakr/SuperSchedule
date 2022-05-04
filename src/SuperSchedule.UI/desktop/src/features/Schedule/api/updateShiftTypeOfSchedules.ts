import { axios } from "../../../lib/axios";
import { ShiftTypeEditableCell } from "../components/EditScheduleTableCell";

type UpdateShiftTypeOfSchedulesOptions = {
  shiftTypeEditableCells: ShiftTypeEditableCell[];
};

export const updateShiftTypeOfSchedules = ({
  shiftTypeEditableCells,
}: UpdateShiftTypeOfSchedulesOptions) => {
  return axios.post(
    "/schedule/UpdateShiftTypeOfSchedules",
    shiftTypeEditableCells
  );
};
