using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Leaves
{
    public interface ILeaveRepository
    {
        IEnumerable<Leave> GetLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate);

        IEnumerable<Leave> GetAllLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate);

        Task CreateLeave(Leave leave);

        bool IsEmployeeHasLeavesForPeriod(int employeeId, DateTime startDate, DateTime endDate);

        bool IsEmployeeHasLeavesForDate(int employeeId, DateTime date);

        bool HasAnyLeavesInPeriod(Leave leave);

        bool IsEmployeeHasSickLeavesForPeriod(int employeeId, DateTime startDate, DateTime endDate);

        IEnumerable<Leave> GetSickLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate);

        bool IsEmployeeHasSickLeavesForDate(int employeeId, DateTime date);

        IEnumerable<DateTime> GetLeaveDatesForEmployee(int employeeId, DateTime startDate, DateTime endDate);

        Task UpdateLeave(Leave leave);

        Task DeleteLeave(int leaveId);

        Leave GetLeaveById(int id);
    }
}
