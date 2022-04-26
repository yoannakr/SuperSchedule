namespace SuperSchedule.Services.Schedules
{
    public interface IScheduleService
    {
        Task FillSchedulesForMonth(DateTime startDate, DateTime endDate);
    }
}
