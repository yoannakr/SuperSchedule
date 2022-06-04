import { axios } from "../../../lib/axios";

type DeleteLocationOptions = {
  locationId: number;
};

export const deleteLocation = (props: DeleteLocationOptions) => {
  const { locationId } = props;

  return axios.delete("/locations/DeleteLocation", {
    params: {
      locationId,
    },
  });
};
