import { axios } from "../../../../lib/axios";

export const getAllCurrentEmployees = () => {
  return axios.get("/employees/GetAllCurrentEmployees");
};
