using SuperSchedule.Database.Models;
using SuperSchedule.Database.Repositories.Leaves;

namespace SuperSchedule.Services.Leaves
{
    public class LeaveService : ILeaveService
    {
        private readonly ILeaveRepository leaveRepository;

        public LeaveService(ILeaveRepository leaveRepository)
        {
            this.leaveRepository = leaveRepository;
        }

        public async Task CreateLeave(Leave leave)
        {
            await leaveRepository.CreateLeave(leave);
        }

        public IEnumerable<Leave> GetLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate)
        {
            return leaveRepository.GetLeavesForEmployee(employeeId, startDate, endDate);
        }

        public IEnumerable<Leave> GetSickLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate)
        {
            return leaveRepository.GetSickLeavesForEmployee(employeeId, startDate, endDate);
        }

        public bool IsEmployeeHasLeavesForDate(int employeeId, DateTime date)
        {
            return leaveRepository.IsEmployeeHasLeavesForDate(employeeId, date);
        }

        public bool IsEmployeeHasSickLeavesForDate(int employeeId, DateTime date)
        {
            return leaveRepository.IsEmployeeHasSickLeavesForDate(employeeId, date);
        }

        public bool IsEmployeeHasLeavesForPeriod(int employeeId, DateTime startDate, DateTime endDate)
        {
            return leaveRepository.IsEmployeeHasLeavesForPeriod(employeeId, startDate, endDate);
        }

        public bool IsEmployeeHasSickLeavesForPeriod(int employeeId, DateTime startDate, DateTime endDate)
        {
            return leaveRepository.IsEmployeeHasSickLeavesForPeriod(employeeId, startDate, endDate);
        }
    }
}
