import { axios } from "../lib/axios";

export const getShiftTypes = () => {
  return axios.get("/shiftTypes/GetAllShiftTypes");
};
