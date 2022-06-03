using SuperSchedule.Database.Models;

namespace SuperSchedule.Services.ShiftTypes
{
    public interface IShiftTypeService
    {
        Task CrateShiftType(ShiftType shiftType);

        IEnumerable<ShiftType> GetAllShiftTypes();

        ShiftType GetShiftTypeById(int id);

        ShiftType GetDefaultBreakShiftType();

        ShiftType GetDefaultLeaveWorkDaysShiftType();

        ShiftType GetDefaultLeaveWeekendDaysShiftType();

        ShiftType GetDefaultSickLeaveWorkDaysShiftType();

        ShiftType GetDefaultSickLeaveWeekendDaysShiftType();

        IEnumerable<ShiftType> GetShiftTypesByLocation(int locationId);

        IEnumerable<ShiftType> GetShiftTypesByLocationIncludingDefaultBreak(int locationId);

        bool IsShiftTypeBreak(ShiftType shiftType);

        bool IsShiftTypeLeave(ShiftType shiftType);

        IEnumerable<ShiftType> GetAllShiftTypesForEmployee(int employeeId);

        IEnumerable<ShiftType> GetAllCurrentShiftTypes();

        Task DeleteShiftType(int shiftTypeId);

        Task UpdateShiftType(ShiftType shiftType);
    }
}
