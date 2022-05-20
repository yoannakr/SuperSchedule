using SuperSchedule.Database.Models;

namespace SuperSchedule.Services.Leaves
{
    public interface ILeaveService
    {
        IEnumerable<Leave> GetLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate);

        Task CreateLeave(Leave leave);

        bool IsEmployeeHasLeavesForPeriod(int employeeId, DateTime startDate, DateTime endDate);

        bool IsEmployeeHasLeavesForDate(int employeeId, DateTime date);
    }
}
