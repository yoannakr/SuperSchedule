import { axios } from "../../../lib/axios";

type DeleteUserOptions = {
  userId: number;
};

export const deleteUser = (props: DeleteUserOptions) => {
  const { userId } = props;

  return axios.delete("/users/DeleteUser", {
    params: {
      userId,
    },
  });
};
