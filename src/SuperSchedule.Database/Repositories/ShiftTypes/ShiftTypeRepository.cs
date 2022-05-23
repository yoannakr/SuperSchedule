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
                .FirstOrDefault(shiftType => shiftType.Id == id);
        }

        public ShiftType GetDefaultBreakShiftType()
        {
            return superScheduleDbContext.ShiftTypes.First(shiftType => shiftType.Location == null && shiftType.Priority == 3);
        }

        public IEnumerable<ShiftType> GetShiftTypesByLocation(int locationId)
        {
            return superScheduleDbContext
                .ShiftTypes
                .Include(s => s.Location)
                .Include(s => s.Days)
                .Where(s => s.Location != null && s.Location.Id == locationId);
        }

        public IEnumerable<ShiftType> GetShiftTypesByLocationIncludingDefaultBreak(int locationId)
        {
            var shiftTypesByLocation = GetShiftTypesByLocation(locationId).ToList();

            shiftTypesByLocation.Add(GetDefaultBreakShiftType());
            shiftTypesByLocation.Add(GetDefaultLeaveWorkDaysShiftType());
            shiftTypesByLocation.Add(GetDefaultLeaveWeekendDaysShiftType());
            shiftTypesByLocation.Add(GetDefaultSickLeaveWorkDaysShiftType());
            shiftTypesByLocation.Add(GetDefaultSickLeaveWeekendDaysShiftType());

            return shiftTypesByLocation;
        }

        public ShiftType GetDefaultLeaveWorkDaysShiftType()
        {
            return superScheduleDbContext.ShiftTypes.First(shiftType => shiftType.Location == null && shiftType.Priority == 1);
        }

        public ShiftType GetDefaultLeaveWeekendDaysShiftType()
        {
            return superScheduleDbContext.ShiftTypes.First(shiftType => shiftType.Location == null && shiftType.Priority == 2);
        }

        public ShiftType GetDefaultSickLeaveWorkDaysShiftType()
        {
            return superScheduleDbContext.ShiftTypes.First(shiftType => shiftType.Location == null && shiftType.Priority == 4);
        }

        public ShiftType GetDefaultSickLeaveWeekendDaysShiftType()
        {
            return superScheduleDbContext.ShiftTypes.First(shiftType => shiftType.Location == null && shiftType.Priority == 5);
        }

        public IEnumerable<ShiftType> GetAllShiftTypesForEmployee(int employeeId)
        {
            var shiftTypesForEmployee = superScheduleDbContext
                 .Employees
                 .Include(e => e.ShiftTypes)
                 .ThenInclude(s => s.Location)
                 .Where(e => e.Id == employeeId)
                 .SelectMany(e => e.ShiftTypes)
                 .ToList();

            shiftTypesForEmployee.Add(GetDefaultBreakShiftType());
            shiftTypesForEmployee.Add(GetDefaultLeaveWorkDaysShiftType());
            shiftTypesForEmployee.Add(GetDefaultLeaveWeekendDaysShiftType());
            shiftTypesForEmployee.Add(GetDefaultSickLeaveWorkDaysShiftType());
            shiftTypesForEmployee.Add(GetDefaultSickLeaveWeekendDaysShiftType());

            return shiftTypesForEmployee;
        }
    }
}
