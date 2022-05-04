using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Schedules
{
    public interface IScheduleRepository
    {
        Task CreateSchedule(Schedule schedule);

        Task CreateSchedule(IEnumerable<Schedule> schedules);

        IEnumerable<Schedule> GetSchedulesByLocationForPeriod(int locationId, DateTime startDate, DateTime endDate);

        Schedule GetScheduleById(int scheduleId);

        Task UpdateShiftTypeOfSchedules(Schedule schedule, int newShiftTypeId);
    }
}
