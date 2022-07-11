import { axios } from "../../../lib/axios";

type GetWorkingHoursForMonthOptions = {
  monthDate: string;
};

export const getWorkingHoursForMonth = ({
  monthDate,
}: GetWorkingHoursForMonthOptions) => {
  return axios.get("/schedule/GetWorkingHoursForMonth", {
    params: {
      monthDate,
    },
  });
};
