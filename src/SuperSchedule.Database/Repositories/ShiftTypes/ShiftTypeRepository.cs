using SuperSchedule.Database.Data;
using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.ShiftTypes
{
    public class ShiftTypeRepository : IShiftTypeRepository
    {
        private readonly SuperScheduleDbContext _superScheduleDbContext;

        public ShiftTypeRepository(SuperScheduleDbContext superScheduleDbContext)
        {
            _superScheduleDbContext = superScheduleDbContext;
        }

        public async Task CrateShiftType(ShiftType shiftType)
        {
            _superScheduleDbContext.ShiftTypes.Add(shiftType);

            await _superScheduleDbContext.SaveChangesAsync();
        }

        public IEnumerable<ShiftType> GetAllShiftTypes()
        {
            return _superScheduleDbContext.ShiftTypes.ToList();
        }
    }
}
