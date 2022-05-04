import { axios } from "../../../lib/axios";

type GetShiftTypesByLocationOptions = {
  locationId: number;
};

export const getShiftTypesByLocation = ({
  locationId,
}: GetShiftTypesByLocationOptions) => {
  return axios.get("/shiftTypes/GetShiftTypesByLocation", {
    params: {
      locationId,
    },
  });
};
