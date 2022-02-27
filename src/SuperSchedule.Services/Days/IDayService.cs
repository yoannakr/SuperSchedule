using SuperSchedule.Database.Models;

namespace SuperSchedule.Services.Days
{
    public interface IDayService
    {
        IEnumerable<Day> GetAllDays();

        Day GetDayById(int dayId);
    }
}
