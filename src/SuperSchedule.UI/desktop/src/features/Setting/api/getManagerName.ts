import { axios } from "../../../lib/axios";

export const getManagerName = () => {
  return axios.get("/settings/GetManagerName");
};
