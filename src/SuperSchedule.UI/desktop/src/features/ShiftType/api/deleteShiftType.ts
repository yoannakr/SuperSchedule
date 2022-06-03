import { axios } from "../../../lib/axios";

type DeleteShiftTypeOptions = {
  shiftTypeId: number;
};

export const deleteShiftType = (props: DeleteShiftTypeOptions) => {
  const { shiftTypeId } = props;

  return axios.delete("/shiftTypes/DeleteShiftType", {
    params: {
      shiftTypeId,
    },
  });
};
