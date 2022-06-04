import { axios } from "../../../lib/axios";
import { Position } from "../../../types";

type UpdatePositionOptions = {
  position: Position;
};

export const updatePosition = async ({ position }: UpdatePositionOptions) => {
  await axios.post("/positions/UpdatePosition", position);
};
