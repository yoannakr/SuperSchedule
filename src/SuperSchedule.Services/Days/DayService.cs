using SuperSchedule.Database.Models;
using SuperSchedule.Database.Repositories.Days;

namespace SuperSchedule.Services.Days
{
    public class DayService : IDayService
    {
        private readonly IDayRepository dayRepository;

        public DayService(IDayRepository dayRepository)
        {
            this.dayRepository = dayRepository;
        }

        public IEnumerable<Day> GetAllDays()
        {
            return dayRepository.GetAllDays();
        }

        public Day GetDayById(int dayId)
        {
            return dayRepository.GetDayById(dayId);
        }
    }
}
