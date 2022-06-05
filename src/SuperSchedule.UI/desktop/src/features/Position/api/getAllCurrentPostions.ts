import { axios } from "../../../lib/axios";

export const getAllCurrentPositions = () => {
  return axios.get("/positions/GetAllCurrentPositions");
};
