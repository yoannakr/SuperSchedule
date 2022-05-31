import { axios } from "../../../../lib/axios";
import { Leave } from "../../../../types";

type UpdateLeaveOptions = {
  leave: Leave;
};

export const updateLeave = async ({ leave }: UpdateLeaveOptions) => {
  return await axios.post("/leaves/UpdateLeave", leave);
};
