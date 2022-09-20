import { axios } from "../../../../lib/axios";

export const getAllReservesEmployees = () => {
  return axios.get("/employees/GetAllReservesEmployees");
};
