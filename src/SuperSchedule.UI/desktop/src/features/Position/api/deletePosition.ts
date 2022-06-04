import { axios } from "../../../lib/axios";

type DeletePositionOptions = {
  positionId: number;
};

export const deletePosition = (props: DeletePositionOptions) => {
  const { positionId } = props;

  return axios.delete("/positions/DeletePosition", {
    params: {
      positionId,
    },
  });
};
