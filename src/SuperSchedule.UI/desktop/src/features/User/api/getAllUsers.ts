import { axios } from "../../../lib/axios";

export const getAllUsers = () => {
  return axios.get("/users/GetAllUsers");
};
