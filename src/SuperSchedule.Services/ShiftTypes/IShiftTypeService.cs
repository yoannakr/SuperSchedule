using SuperSchedule.Database.Models;

namespace SuperSchedule.Services.ShiftTypes
{
    public interface IShiftTypeService
    {
        Task CrateShiftType(ShiftType shiftType);

        IEnumerable<ShiftType> GetAllShiftTypes();
    }
}
