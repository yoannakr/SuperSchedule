import { axios } from "../../../lib/axios";
import { ShiftType } from "../../../types/index";

type CreateShiftTypeOptions = {
  shiftType: ShiftType;
};

export const createShitType = async ({ shiftType }: CreateShiftTypeOptions) => {
  await axios.post("/shiftTypes/CreateShiftType", shiftType);
};
