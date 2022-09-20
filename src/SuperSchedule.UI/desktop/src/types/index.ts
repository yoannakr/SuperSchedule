import { ShiftTypeEditableCell } from "../features/Schedule/components/EditScheduleTableCell";

export type ShiftType = {
  id: number;
  name: string;
  abbreviation: string;
  startTime?: moment.Moment;
  endTime?: moment.Moment;
  rotationDays?: number;
  priority?: number;
  isDeleted?: boolean;
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
  shiftTypesTemplateName?: string;
  isAutomationFill: boolean;
  isDeleted?: boolean;
};

export type Day = {
  id: number;
  name: string;
};

export type Position = {
  id: number;
  name: string;
  abbreviation: string;
  priority?: number;
};

export type Employee = {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName?: string;
  vacationDays: number;
  positionId: number;
  positionName?: string;
  isDeleted?: boolean;
  locationsIds: number[];
  shiftTypesIds: number[];
  previousEmployeeId: number;
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
  leaveTypeName?: string;
  comment: string;
  employeeId: number;
};

export type User = {
  id: number;
  username: string;
  password: string;
  role: number;
  roleName?: string;
};
