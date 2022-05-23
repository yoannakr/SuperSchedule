import { axios } from "../../../lib/axios";

type GetAllShiftTypesForEmployeeOptions = {
  employeeId: number;
};

export const getAllShiftTypesForEmployee = ({
  employeeId,
}: GetAllShiftTypesForEmployeeOptions) => {
  return axios.get("/shiftTypes/GetAllShiftTypesForEmployee", {
    params: {
      employeeId,
    },
  });
};
