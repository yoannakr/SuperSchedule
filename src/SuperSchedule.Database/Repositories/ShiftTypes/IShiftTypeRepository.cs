﻿using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.ShiftTypes
{
    public interface IShiftTypeRepository
    {
        Task CrateShiftType(ShiftType shiftType);

        IEnumerable<ShiftType> GetAllShiftTypes();

        ShiftType GetShiftTypeById(int id);

        ShiftType GetDefaultBreakShiftType();

        IEnumerable<ShiftType> GetShiftTypesByLocation(int locationId);

        IEnumerable<ShiftType> GetShiftTypesByLocationIncludingDefaultBreak(int locationId);

        ShiftType GetDefaultLeaveWorkDaysShiftType();

        ShiftType GetDefaultLeaveWeekendDaysShiftType();

        ShiftType GetDefaultSickLeaveWorkDaysShiftType();

        ShiftType GetDefaultSickLeaveWeekendDaysShiftType();

        IEnumerable<ShiftType> GetAllShiftTypesForEmployee(int employeeId);

        IEnumerable<ShiftType> GetAllCurrentShiftTypes();

        Task DeleteShiftType(int shiftTypeId);

        Task UpdateShiftType(ShiftType shiftType);
    }
}
