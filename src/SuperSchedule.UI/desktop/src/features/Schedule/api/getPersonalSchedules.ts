import moment from "moment";
import { axios } from "../../../lib/axios";

type GetPersonalSchedulesOptions = {
  employeeId: number;
  monthDate: string;
};

export const getPersonalSchedules = ({
  employeeId,
  monthDate,
}: GetPersonalSchedulesOptions) => {
  return axios.get("/schedule/GetPersonalSchedules", {
    params: {
      employeeId,
      monthDate,
    },
  });
};
