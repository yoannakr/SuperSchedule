using SuperSchedule.Database.Models;

namespace SuperSchedule.Services.Schedules
{
    public interface IScheduleService
    {
        Task FillSchedulesForMonth(DateTime startDate, DateTime endDate);

        IEnumerable<Schedule> GetSchedulesByLocationForPeriod(int locationId, DateTime startDate, DateTime endDate);

        Task<(bool, IEnumerable<string>)> UpdateShiftTypeOfSchedules(List<Schedule> schedules);

        (Employee employee, IEnumerable<Schedule> schedules) GetPersonalSchedules(int employeeId, DateTime startDate, DateTime endDate);
       
        Task UpdatePersonalScheduleShiftTypes(int employeeId, List<Schedule> schedules);

        IEnumerable<string> GetErrorsForMonthSchedule(DateTime firstDayOfMonth, DateTime lastDayOfMonth);

        double GetOverWorkingHoursForMonth(Employee employee, DateTime startDate, DateTime endDate);

        int CalculateWorkingHoursForMonth(DateTime dateTime);

        bool IsScheduleFilled(DateTime firstDayOfMonth, DateTime lastDayOfMonth);
    }
}
