import { axios } from "../lib/axios";

export const getDays = () => {
  return axios.get("/days/GetAllDays");
};
