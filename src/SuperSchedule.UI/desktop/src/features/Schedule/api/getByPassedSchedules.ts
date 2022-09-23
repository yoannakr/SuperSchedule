import moment from "moment";
import { axios } from "../../../lib/axios";

type GetByPassedSchedulesOptions = {
  monthDate: string;
};

export const getByPassedSchedules = ({
  monthDate,
}: GetByPassedSchedulesOptions) => {
  return axios.get("/schedule/GetByPassedSchedules", {
    params: {
      monthDate,
    },
  });
};
