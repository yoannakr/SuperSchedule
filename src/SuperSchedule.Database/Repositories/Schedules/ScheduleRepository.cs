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
    }
}
