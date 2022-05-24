import moment from "moment";
import { axios } from "../../../lib/axios";

type GetErrorsForMonthScheduleOptions = {
  monthDate: string;
};

export const getErrorsForMonthSchedule = ({
  monthDate,
}: GetErrorsForMonthScheduleOptions) => {
  return axios.get("/schedule/GetErrorsForMonthSchedule", {
    params: {
      monthDate,
    },
  });
};
