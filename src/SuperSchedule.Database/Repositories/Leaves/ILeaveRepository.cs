using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Leaves
{
    public interface ILeaveRepository
    {
        IEnumerable<Leave> GetLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate);

        Task CreateLeave(Leave leave);

        bool IsEmployeeHasLeavesForPeriod(int employeeId, DateTime startDate, DateTime endDate);

        bool IsEmployeeHasLeavesForDate(int employeeId, DateTime date);
    }
}
