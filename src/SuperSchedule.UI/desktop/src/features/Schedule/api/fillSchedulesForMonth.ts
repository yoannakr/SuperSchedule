import moment from "moment";
import { axios } from "../../../lib/axios";

type FillSchedulesForMonthOptions = {
  monthDate: string;
};

export const fillSchedulesForMonth = ({
  monthDate,
}: FillSchedulesForMonthOptions) => {
  return axios.post("/schedule/FillSchedulesForMonth", null, {
    params: {
      monthDate,
    },
  });
};
