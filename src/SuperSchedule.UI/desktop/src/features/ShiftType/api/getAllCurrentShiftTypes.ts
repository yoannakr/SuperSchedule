import { axios } from "../../../lib/axios";

export const getAllCurrentShiftTypes = () => {
  return axios.get("/shiftTypes/GetAllCurrentShiftTypes");
};
