using SuperSchedule.Database.Data;
using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Days
{
    public class DayRepository : IDayRepository
    {
        private readonly SuperScheduleDbContext superScheduleDbContext;

        public DayRepository(SuperScheduleDbContext superScheduleDbContext)
        {
            this.superScheduleDbContext = superScheduleDbContext;
        }

        public IEnumerable<Day> GetAllDays()
        {
            return superScheduleDbContext.Days.ToList();
        }

        public Day GetDayById(int id)
        {
            return superScheduleDbContext.Days.FirstOrDefault(d => d.Id == id);
        }
    }
}
