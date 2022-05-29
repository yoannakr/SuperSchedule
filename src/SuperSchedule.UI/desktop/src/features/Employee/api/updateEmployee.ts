import { axios } from "../../../lib/axios";
import { Employee } from "../../../types";

type UpdateEmployeeOptions = {
  employee: Employee;
};

export const updateEmployee = async ({ employee }: UpdateEmployeeOptions) => {
  await axios.post("/employees/UpdateEmployee", employee);
};
