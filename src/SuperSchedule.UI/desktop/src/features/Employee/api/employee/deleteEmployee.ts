import { axios } from "../../../../lib/axios";

type DeleteEmployeeOptions = {
  employeeId: number;
};

export const deleteEmployee = (props: DeleteEmployeeOptions) => {
  const { employeeId } = props;

  return axios.delete("/employees/DeleteEmployee", {
    params: {
      employeeId,
    },
  });
};
