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
            var contextShiftType = superScheduleDbContext.ShiftTypes.FirstOrDefault(s => s.Id == newShiftTypeId);

            if (schedule.RemovedShiftType == null && schedule.ShiftType != null)
            {
                var previousShiftType = superScheduleDbContext.ShiftTypes.FirstOrDefault(s => s.Id == schedule.ShiftType.Id);
                schedule.RemovedShiftType = previousShiftType;
            }
            schedule.ShiftType = contextShiftType;

            superScheduleDbContext.Schedules.Update(schedule);
            await superScheduleDbContext.SaveChangesAsync();
        }

        public IEnumerable<Schedule> GetSchedulesByLocationForPeriod(int locationId, DateTime startDate, DateTime endDate)
        {
            return superScheduleDbContext
                .Schedules
                .Include(s => s.Employee.Position)
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
                .FirstOrDefault(s => s.ShiftType != null && s.Location != null && s.Location.Id == locationId && s.Employee.Id == employee.Id && s.Date.Date >= firstDayOfMonth.Date && s.Date.Date <= lastDayOfMonth.Date && s.DayOfWeekTemplate != null)?
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

        public IEnumerable<Schedule> GetEmployeeSchedulesForDate(DateTime date, Employee employee)
        {
            return superScheduleDbContext
               .Schedules
               .Include(s => s.Employee)
               .Include(s => s.ShiftType)
               .Include(s => s.Location)
               .Where(s => s.Date.Date == date.Date && s.Employee.Id == employee.Id);
        }

        public bool IsScheduleFilled(DateTime firstDayOfMonth, DateTime lastDayOfMonth)
        {
            return superScheduleDbContext
               .Schedules
               .Include(s => s.Employee)
               .Include(s => s.ShiftType)
               .Include(s => s.Location)
               .Any(s => s.Date.Date >= firstDayOfMonth.Date && s.Date.Date <= lastDayOfMonth.Date);
        }

        public async Task RemoveSchedulesForPeriod(DateTime startDate, DateTime endDate)
        {
            var schedules = superScheduleDbContext
                .Schedules
                .Where(s => s.Date.Date >= startDate && s.Date <= endDate)
                .ToList();

            superScheduleDbContext.Schedules.RemoveRange(schedules);
            await superScheduleDbContext.SaveChangesAsync();
        }

        public bool IsScheduleExist(int employeeId, int locationId, DateTime date)
        {
            var contextSchedules = superScheduleDbContext
                .Schedules
                .Where(s => s.Date.Date == date.Date &&
                            s.Employee.Id == employeeId &&
                            s.Location.Id == locationId).ToList();

            return contextSchedules.Any();
        }

        public async Task UpdateSchedule(Schedule schedule)
        {
            var contextSchedule = superScheduleDbContext
                .Schedules
                .FirstOrDefault(s => s.Date.Date == schedule.Date.Date &&
                            s.Employee.Id == schedule.Employee.Id &&
                            s.Location.Id == schedule.Location.Id);

            contextSchedule.ShiftType = schedule.ShiftType;
            contextSchedule.RemovedShiftType = schedule.RemovedShiftType;
            contextSchedule.LastRotationDays = schedule.LastRotationDays;
            contextSchedule.DayOfWeekTemplate = schedule.DayOfWeekTemplate;

            superScheduleDbContext.Schedules.Update(contextSchedule);
            await superScheduleDbContext.SaveChangesAsync();
        }
    }
}
