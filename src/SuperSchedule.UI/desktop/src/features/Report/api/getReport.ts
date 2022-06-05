import { axios } from "../../../lib/axios";

type GetReportOptions = {
  fromMonth: string;
  toMonth: string;
};

export const getReport = ({ fromMonth, toMonth }: GetReportOptions) => {
  return axios.get("/report/GetReport", {
    params: {
      fromMonth,
      toMonth,
    },
  });
};
