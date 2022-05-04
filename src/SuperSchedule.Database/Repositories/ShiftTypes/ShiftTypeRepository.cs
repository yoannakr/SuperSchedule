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
                .Where(s => s.Id != 1) // без дефоултната
                .ToList();
        }

        public ShiftType GetShiftTypeById(int id)
        {
            return superScheduleDbContext
                .ShiftTypes
                .Include(s => s.Location)
                .Include(s => s.Days)
                .First(shiftType => shiftType.Id == id);
        }

        public ShiftType GetDefaultBreakShiftType()
        {
            return superScheduleDbContext.ShiftTypes.First(shiftType => shiftType.Priority == 0);
        }

        public IEnumerable<ShiftType> GetShiftTypesByLocation(int locationId)
        {
            return superScheduleDbContext
                .ShiftTypes
                .Include(s => s.Location)
                .Include(s => s.Days)
                .Where(s => s.Location != null && s.Location.Id == locationId);
        }
    }
}
