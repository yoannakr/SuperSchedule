import { ShiftTypeEditableCell } from "../features/Schedule/components/EditScheduleTableCell";

export type ShiftType = {
  id: number;
  name: string;
  abbreviation: string;
  startTime: moment.Moment;
  endTime: moment.Moment;
  rotationDays: number;
  locationId: number;
  daysIds: number[];
};

export type Location = {
  id: number;
  name: string;
  abbreviation: string;
};

export type Day = {
  id: number;
  name: string;
};

export type Position = {
  id: number;
  name: string;
  abbreviation: string;
};

export type Employee = {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  vacationDays: number;
  positionId: number;
  locationsIds: number[];
  shiftTypesIds: number[];
};

export type Schedule = {
  id: number;
  location: Location;
  employee: Employee;
  shiftType: ShiftType;
  shiftTypeEditableCells: ShiftTypeEditableCell[];
  date: moment.Moment;
};
