import { axios } from "../../../lib/axios";
import { User } from "../../../types";

type LoginOptions = {
  username: string;
  password: string;
};

export const login = async ({ username, password }: LoginOptions) => {
  return await axios.get("/users/Login", {
    params: {
      username,
      password,
    },
  });
};
