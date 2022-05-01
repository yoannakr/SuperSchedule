import { axios } from "../../../lib/axios";

export const getSettings = () => {
  return axios.get("/settings/GetSettings");
};
