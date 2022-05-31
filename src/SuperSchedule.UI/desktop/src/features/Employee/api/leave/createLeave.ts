import { axios } from "../../../../lib/axios";
import { Leave } from "../../../../types";

type CreateLeaveOptions = {
  leave: Leave;
};

export const createLeave = async ({ leave }: CreateLeaveOptions) => {
  await axios.post("/leaves/CreateLeave", leave);
};
