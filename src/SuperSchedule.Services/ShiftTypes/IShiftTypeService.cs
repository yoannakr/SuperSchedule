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

        IEnumerable<ShiftType> GetShiftTypesByLocation(int locationId);

        IEnumerable<ShiftType> GetShiftTypesByLocationIncludingDefaultBreak(int locationId);

        bool IsShiftTypeBreak(ShiftType shiftType);

        bool IsShiftTypeLeave(ShiftType shiftType);
    }
}
