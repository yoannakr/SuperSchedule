import { axios } from "../../../lib/axios";
import { User } from "../../../types";

type CreateUserOptions = {
  user: User;
};

export const createUser = async ({ user }: CreateUserOptions) => {
  await axios.post("/users/CreateUser", user);
};
