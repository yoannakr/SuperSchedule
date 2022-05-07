import { axios } from "../../../lib/axios";

type GetShiftTypesByLocationIncludingDefaultBreakOptions = {
  locationId: number;
};

export const getShiftTypesByLocationIncludingDefaultBreak = ({
  locationId,
}: GetShiftTypesByLocationIncludingDefaultBreakOptions) => {
  return axios.get("/shiftTypes/GetShiftTypesByLocationIncludingDefaultBreak", {
    params: {
      locationId,
    },
  });
};
