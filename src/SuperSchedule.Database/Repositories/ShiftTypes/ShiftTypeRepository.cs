using Microsoft.EntityFrameworkCore;
using SuperSchedule.Database.Data;
using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.ShiftTypes
{
    public class ShiftTypeRepository : IShiftTypeRepository
    {
        private readonly SuperScheduleDbContext superScheduleDbContext;

        public ShiftTypeRepository(SuperScheduleDbContext superScheduleDbContext)
        {
            this.superScheduleDbContext = superScheduleDbContext;
        }

        public async Task CrateShiftType(ShiftType shiftType)
        {
            superScheduleDbContext.ShiftTypes.Add(shiftType);

            await superScheduleDbContext.SaveChangesAsync();
        }

        public IEnumerable<ShiftType> GetAllShiftTypes()
        {
            return superScheduleDbContext
                .ShiftTypes
                .Include(s => s.Location)
                .Include(s => s.Days)
                .ToList();
        }

        public ShiftType GetShiftTypeById(int id)
        {
            return superScheduleDbContext.ShiftTypes.First(shiftType => shiftType.Id == id);
        }
    }
}
