using SuperSchedule.Database.Models;

namespace SuperSchedule.Services.Schedules
{
    public interface IScheduleService
    {
        Task FillSchedulesForMonth(DateTime startDate, DateTime endDate);

        IEnumerable<Schedule> GetSchedulesByLocationForPeriod(int locationId, DateTime startDate, DateTime endDate);

        Task UpdateShiftTypeOfSchedules(List<Schedule> schedules);
    }
}
