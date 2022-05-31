import { axios } from "../../../../lib/axios";

export const getAllEmployees = () => {
  return axios.get("/employees/GetAllEmployees");
};
