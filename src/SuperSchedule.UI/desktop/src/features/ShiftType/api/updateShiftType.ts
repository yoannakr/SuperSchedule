import { axios } from "../../../lib/axios";
import { ShiftType } from "../../../types";

type UpdateShiftTypeOptions = {
  shiftType: ShiftType;
};

export const updateShiftType = async ({
  shiftType,
}: UpdateShiftTypeOptions) => {
  await axios.post("/shiftTypes/UpdateShiftType", shiftType);
};
