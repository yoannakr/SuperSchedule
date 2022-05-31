import { axios } from "../../../../lib/axios";
import { Employee } from "../../../../types";

type CreateEmployeeOptions = {
  employee: Employee;
};

export const createEmployee = async ({ employee }: CreateEmployeeOptions) => {
  await axios.post("/employees/CreateEmployee", employee);
};
