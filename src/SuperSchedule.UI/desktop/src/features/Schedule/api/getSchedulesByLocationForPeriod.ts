import moment from "moment";
import { axios } from "../../../lib/axios";

type GetSchedulesForPeriodOptions = {
  locationId: number;
  startDate: string;
  endDate: string;
};

export const getSchedulesByLocationForPeriod = ({
  locationId,
  startDate,
  endDate,
}: GetSchedulesForPeriodOptions) => {
  return axios.get("/schedule/GetSchedulesByLocationForPeriod", {
    params: {
      locationId: locationId,
      startDate: startDate,
      endDate: endDate,
    },
  });
};
