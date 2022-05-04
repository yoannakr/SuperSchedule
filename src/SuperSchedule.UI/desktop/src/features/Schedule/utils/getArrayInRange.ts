export const getArrayInRange = (start: number, end: number): number[] =>
  [...Array(end - start + 1).keys()].map((x) => x + start);
