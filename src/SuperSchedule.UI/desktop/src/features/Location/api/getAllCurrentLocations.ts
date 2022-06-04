import { axios } from "../../../lib/axios";

export const getAllCurrentLocations = () => {
  return axios.get("/locations/GetAllCurrentLocations");
};
