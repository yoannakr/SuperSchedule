using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Schedules
{
    public interface IScheduleRepository
    {
        Task CreateSchedule(Schedule schedule);

        Task CreateSchedule(IEnumerable<Schedule> schedules);
    }
}
