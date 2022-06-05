import { axios } from "../../../lib/axios";

type GetReportMonthsOptions = {
  fromMonth: string;
  toMonth: string;
};

export const getReportMonths = ({
  fromMonth,
  toMonth,
}: GetReportMonthsOptions) => {
  return axios.get("/report/GetReportMonths", {
    params: {
      fromMonth,
      toMonth,
    },
  });
};
