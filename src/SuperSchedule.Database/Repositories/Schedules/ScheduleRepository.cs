using Microsoft.EntityFrameworkCore;
using SuperSchedule.Database.Data;
using SuperSchedule.Database.Enums;
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
                superScheduleDbContext.Schedules.Remove(schedule);
                await superScheduleDbContext.SaveChangesAsync();
                return;
            }
            else
            {
                var previousShiftType = superScheduleDbContext.ShiftTypes.FirstOrDefault(s => s.Id == schedule.ShiftType.Id);
                var contextShiftType = superScheduleDbContext.ShiftTypes.FirstOrDefault(s => s.Id == newShiftTypeId);
                
                schedule.RemovedShiftType = previousShiftType;
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
                .ThenInclude(e => e.ShiftTypes)
                .Include(s => s.ShiftType)
                .Include(s => s.Location)
                .Where(s => s.Location != null && s.Location.Id == locationId && s.Date.Date >= startDate.Date && s.Date.Date <= endDate.Date)
                .OrderBy(s => s.Date)
                .ThenBy(s => s.Employee.Position.Priority)
                .ToList();
        }

        public Schedule GetEmployeeScheduleByLocationForDate(int locationId, DateTime date, Employee employee)
        {
            return superScheduleDbContext
                .Schedules
                .Include(s => s.Employee)
                .Include(s => s.ShiftType)
                .Include(s => s.Location)
                .FirstOrDefault(s => s.Location != null && s.Location.Id == locationId && s.Date.Date == date.Date && s.Employee.Id == employee.Id);
        }

        public bool IsScheduleFilledForPreviousMonth(int locationId, DateTime date)
        {
            return superScheduleDbContext
                .Schedules
                .Include(s => s.Employee)
                .Include(s => s.ShiftType)
                .Include(s => s.Location)
                .Any(s => s.Location != null && s.Location.Id == locationId && s.Date.Date == date.Date);
        }

        public bool IsEmployeeAvailable(DateTime date, Employee employee)
        {
            return !superScheduleDbContext
                .Schedules
                .Include(s => s.Employee)
                .Include(s => s.ShiftType)
                .Include(s => s.Location)
                .Any(s => s.Employee.Id == employee.Id && s.Date.Date == date.Date && s.ShiftType != null);
        }

        public DayOfWeekTemplate? GetDayOfWeekTemplateForMonth(int locationId, DateTime monthDate, Employee employee)
        {
            var firstDayOfMonth = new DateTime(monthDate.Year, monthDate.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            return superScheduleDbContext
                .Schedules
                .Include(s => s.Employee)
                .Include(s => s.ShiftType)
                .Include(s => s.Location)
                .FirstOrDefault(s => s.Location != null && s.Location.Id == locationId && s.Employee.Id == employee.Id && s.Date.Date >= firstDayOfMonth.Date && s.Date.Date <= lastDayOfMonth.Date && s.DayOfWeekTemplate != null)?
                .DayOfWeekTemplate;
        }

        public IEnumerable<Schedule> GetEmployeeScheduleForPeriod(DateTime startDate, DateTime endDate, int employeeId)
        {
            return superScheduleDbContext
                .Schedules
                .Include(s => s.Employee)
                .ThenInclude(e => e.ShiftTypes)
                .Include(s => s.ShiftType)
                .ThenInclude(sh => sh.Location)
                .Include(s => s.Location)
                .Where(s => s.Employee.Id == employeeId && s.Date.Date >= startDate.Date && s.Date.Date <= endDate.Date)
                .ToList();
        }

        public Schedule GetEmployeeScheduleForDate(DateTime date, Employee employee)
        {
            return superScheduleDbContext
               .Schedules
               .Include(s => s.Employee)
               .Include(s => s.ShiftType)
               .Include(s => s.Location)
               .FirstOrDefault(s => s.Date.Date == date.Date && s.Employee.Id == employee.Id);
        }
    }
}
