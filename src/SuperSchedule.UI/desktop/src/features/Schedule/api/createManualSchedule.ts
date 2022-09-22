import { axios } from "../../../lib/axios";
import { ManualSchedule } from "../../../types";

type CreateManualScheduleOptions = {
  manualSchedule: ManualSchedule;
};

export const createManualSchedule = ({
  manualSchedule,
}: CreateManualScheduleOptions) => {
  return axios.post("/schedule/CreateManualSchedule", manualSchedule);
};
