import { axios } from "../lib/axios";

export const getLocations = () => {
  return axios.get("/locations/GetAllLocations");
};
