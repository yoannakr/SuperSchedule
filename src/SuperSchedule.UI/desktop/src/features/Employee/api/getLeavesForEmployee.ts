import moment from "moment";
import { axios } from "../../../lib/axios";

type GetLeavesForEmployeeOptions = {
  employeeId: number;
  startDate: string;
  endDate: string;
};

export const getLeavesForEmployee = ({
  employeeId,
  startDate,
  endDate,
}: GetLeavesForEmployeeOptions) => {
  return axios.get("/leaves/GetLeavesForEmployee", {
    params: {
      employeeId,
      startDate,
      endDate,
    },
  });
};
