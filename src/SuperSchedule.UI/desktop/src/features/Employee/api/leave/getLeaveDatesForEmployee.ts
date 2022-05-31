import moment from "moment";
import { axios } from "../../../../lib/axios";

type GetLeaveDatesForEmployeeOptions = {
  employeeId: number;
  startDate: string;
  endDate: string;
};

export const getLeaveDatesForEmployee = ({
  employeeId,
  startDate,
  endDate,
}: GetLeaveDatesForEmployeeOptions) => {
  return axios.get("/leaves/GetLeaveDatesForEmployee", {
    params: {
      employeeId,
      startDate,
      endDate,
    },
  });
};
