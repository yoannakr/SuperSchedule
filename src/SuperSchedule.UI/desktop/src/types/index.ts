import { ShiftTypeEditableCell } from "../features/Schedule/components/EditScheduleTableCell";

export type ShiftType = {
  id: number;
  name: string;
  abbreviation: string;
  startTime?: moment.Moment;
  endTime?: moment.Moment;
  rotationDays?: number;
  priority?: number;
  locationId?: number;
  nightHours?: number;
  daysIds?: number[];
};

export type Location = {
  id: number;
  name: string;
  abbreviation: string;
  priority: number;
  shiftTypesTemplate: number;
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

export type Leave = {
  id: number;
  fromDate: moment.Moment;
  toDate: moment.Moment;
  leaveTypeId: number;
  comment: string;
  employeeId: number;
};
