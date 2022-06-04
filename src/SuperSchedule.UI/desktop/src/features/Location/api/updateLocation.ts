import { axios } from "../../../lib/axios";
import { Location } from "../../../types";

type UpdateLocationOptions = {
  location: Location;
};

export const updateLocation = async ({ location }: UpdateLocationOptions) => {
  await axios.post("/locations/UpdateLocation", location);
};
