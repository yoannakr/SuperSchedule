import { axios } from "../lib/axios";

export const getPositions = () => {
  return axios.get("/positions/GetAllPositions");
};
