using Microsoft.EntityFrameworkCore;
using SuperSchedule.Database.Data;
using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Schedules
{
    public class ScheduleRepository : IScheduleRepository
    {
        private readonly SuperScheduleDbContext superScheduleDbContext;

        public ScheduleRepository(SuperScheduleDbContext superScheduleDbContext)
        {
            this.superScheduleDbContext = superScheduleDbContext;
        }

        public async Task CreateSchedule(Schedule schedule)
        {
            superScheduleDbContext.Schedules.Add(schedule);

            await superScheduleDbContext.SaveChangesAsync();
        }

        public async Task CreateSchedule(IEnumerable<Schedule> schedules)
        {
            superScheduleDbContext.Schedules.AddRange(schedules);

            await superScheduleDbContext.SaveChangesAsync();
        }

        public Schedule GetScheduleById(int scheduleId)
        {
            return superScheduleDbContext.Schedules
                .Include(s => s.Employee)
                .Include(s => s.ShiftType)
                .Include(s => s.Location)
                .FirstOrDefault(s => s.Id == scheduleId);
        }

        public async Task UpdateShiftTypeOfSchedules(Schedule schedule, int newShiftTypeId)
        {
            if (newShiftTypeId == 0)
            {
                schedule.ShiftType = null;
            }
            else
            {
                var contextShiftType = superScheduleDbContext.ShiftTypes.FirstOrDefault(s => s.Id == newShiftTypeId);

                schedule.ShiftType = contextShiftType;
            }

            superScheduleDbContext.Schedules.Update(schedule);
            await superScheduleDbContext.SaveChangesAsync();
        }

        public IEnumerable<Schedule> GetSchedulesByLocationForPeriod(int locationId, DateTime startDate, DateTime endDate)
        {
            return superScheduleDbContext
                .Schedules
                .Include(s => s.Employee)
                .Include(s => s.ShiftType)
                .Include(s => s.Location)
                .Where(s => s.Location.Id == locationId && s.Date.Date >= startDate.Date && s.Date.Date <= endDate.Date)
                .OrderBy(s => s.Date)
                .ToList();
        }

        public Schedule GetEmployeeScheduleByLocationForDate(int locationId, DateTime date, Employee employee)
        {
            return superScheduleDbContext
                .Schedules
                .Include(s => s.Employee)
                .Include(s => s.ShiftType)
                .Include(s => s.Location)
                .FirstOrDefault(s => s.Location.Id == locationId && s.Date.Date == date.Date && s.Employee.Id == employee.Id);
        }

        public bool IsScheduleFilledForPreviousMonth(int locationId, DateTime date)
        {
            return superScheduleDbContext
                .Schedules
                .Include(s => s.Employee)
                .Include(s => s.ShiftType)
                .Include(s => s.Location)
                .Any(s => s.Location.Id == locationId && s.Date.Date == date.Date);
        }
    }
}
