using SuperSchedule.Database.Models;

namespace SuperSchedule.Services.Leaves
{
    public interface ILeaveService
    {
        IEnumerable<Leave> GetLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate);

        IEnumerable<Leave> GetAllLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate);

        IEnumerable<Leave> GetSickLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate);

        Task<(bool, IEnumerable<string>)> CreateLeave(Leave leave);

        bool IsEmployeeHasLeavesForPeriod(int employeeId, DateTime startDate, DateTime endDate);

        bool IsEmployeeHasSickLeavesForPeriod(int employeeId, DateTime startDate, DateTime endDate);

        bool IsEmployeeHasLeavesForDate(int employeeId, DateTime date);

        bool IsEmployeeHasSickLeavesForDate(int employeeId, DateTime date);

        IEnumerable<DateTime> GetLeaveDatesForEmployee(int employeeId, DateTime startDate, DateTime endDate);

        Task UpdateLeave(Leave leave);

        Task DeleteLeave(int leaveId);
    }
}
