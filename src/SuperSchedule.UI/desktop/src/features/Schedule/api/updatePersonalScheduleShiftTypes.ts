import { axios } from "../../../lib/axios";
import { ShiftTypeEditableCell } from "../components/EditScheduleTableCell";
import { PersonalScheduleRow } from "../components/PersonalSchedule";

type UpdatePersonalScheduleShiftTypesOptions = {
  scheduleModel: PersonalScheduleRow | undefined;
};

export const updatePersonalScheduleShiftTypes = ({
  scheduleModel,
}: UpdatePersonalScheduleShiftTypesOptions) => {
  return axios.post(
    "/schedule/UpdatePersonalScheduleShiftTypes",
    scheduleModel
  );
};
