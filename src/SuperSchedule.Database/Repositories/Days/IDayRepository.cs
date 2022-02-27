using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Days
{
    public interface IDayRepository
    {
        IEnumerable<Day> GetAllDays();

        Day GetDayById(int id);
    }
}
