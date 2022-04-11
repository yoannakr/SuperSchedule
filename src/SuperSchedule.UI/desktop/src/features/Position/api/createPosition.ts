import { axios } from "../../../lib/axios";
import { Position } from "../../../types";

type CreatePositionOptions = {
  position: Position;
};

export const createPosition = async ({ position }: CreatePositionOptions) => {
  await axios.post("/positions/CreatePosition", position);
};
