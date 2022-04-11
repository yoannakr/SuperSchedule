import { axios } from "../../../lib/axios";
import { Location } from "../../../types";

type CreateLocationOptions = {
  location: Location;
};

export const createLocation = async ({ location }: CreateLocationOptions) => {
  await axios.post("/locations/CreateLocation", location);
};
