import { axios } from "../../../lib/axios";

type IsScheduleFilledOptions = {
  monthDate: string;
};

export const isScheduleFilled = ({ monthDate }: IsScheduleFilledOptions) => {
  return axios.get("/schedule/IsScheduleFilled", {
    params: {
      monthDate,
    },
  });
};
