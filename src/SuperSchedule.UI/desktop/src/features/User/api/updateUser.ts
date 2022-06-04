import { axios } from "../../../lib/axios";
import { User } from "../../../types";

type UpdateUserOptions = {
  user: User;
};

export const updateUser = async ({ user }: UpdateUserOptions) => {
  await axios.post("/users/UpdateUser", user);
};
