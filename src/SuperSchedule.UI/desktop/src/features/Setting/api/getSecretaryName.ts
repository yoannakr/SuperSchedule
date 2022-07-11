import { axios } from "../../../lib/axios";

export const getSecretaryName = () => {
  return axios.get("/settings/GetSecretaryName");
};
