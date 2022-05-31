import { axios } from "../../../../lib/axios";

type DeleteLeaveOptions = {
  leaveId: number;
};

export const deleteLeave = async ({ leaveId }: DeleteLeaveOptions) => {
  await axios.delete("/leaves/DeleteLeave", {
    params: {
      leaveId,
    },
  });
};
