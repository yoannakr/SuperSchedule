export const isShiftTypeDefaultType = (
  locationId: number,
  priority: number
): boolean => {
  return (
    locationId === 0 &&
    (priority === 1 ||
      priority === 2 ||
      priority === 3 ||
      priority === 4 ||
      priority === 5)
  );
};
