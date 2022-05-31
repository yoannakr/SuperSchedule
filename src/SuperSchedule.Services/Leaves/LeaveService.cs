using SuperSchedule.Database.Common;
using SuperSchedule.Database.Models;
using SuperSchedule.Database.Repositories.Leaves;
using SuperSchedule.Services.Employees;

namespace SuperSchedule.Services.Leaves
{
    public class LeaveService : ILeaveService
    {
        private readonly ILeaveRepository leaveRepository;
        private readonly IEmployeeService employeeService;

        public LeaveService(ILeaveRepository leaveRepository, IEmployeeService employeeService)
        {
            this.leaveRepository = leaveRepository;
            this.employeeService = employeeService;
        }

        public async Task<(bool, IEnumerable<string>)> CreateLeave(Leave leave)
        {
            var contextEmployee = employeeService.GetEmployeeById(leave.Employee.Id);
            if (contextEmployee == null)
            {
                return (true, new List<string> { $"Несъществуващ служител!" });
            }

            var newVacationDaysTotal = 0;
            var hasToUpdateEmployee = false;
            if (leave.LeaveType == Database.Enums.LeaveType.Holidays)
            {
                var totalDays = Helper.GetRangeOfDates(0, leave.FromDate.Date, leave.ToDate.Date)
                    .Where(d => d.DayOfWeek != DayOfWeek.Saturday && d.DayOfWeek != DayOfWeek.Sunday)
                    .ToList()
                    .Count;
                newVacationDaysTotal = contextEmployee.VacationDays - totalDays;
                if (newVacationDaysTotal < 0)
                {
                    return (true, new List<string> { $"Служителят не разполага с въведения брой дни отпуска!" });
                }

                hasToUpdateEmployee = true;
            }

            var hasAnyLeavesInPeriod = leaveRepository.HasAnyLeavesInPeriod(leave);
            if (hasAnyLeavesInPeriod)
            {
                return (true, new List<string> { $"Съществува отпуска/болничен за тези дати!" });
            }

            await leaveRepository.CreateLeave(leave);

            if (hasToUpdateEmployee)
            {
                await employeeService.UpdateEmployeeVacationDays(contextEmployee, newVacationDaysTotal);
            }

            return (false, Enumerable.Empty<string>());
        }

        public IEnumerable<Leave> GetLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate)
        {
            return leaveRepository.GetLeavesForEmployee(employeeId, startDate, endDate);
        }

        public IEnumerable<Leave> GetAllLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate)
        {
            return leaveRepository.GetAllLeavesForEmployee(employeeId, startDate, endDate);
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

        public IEnumerable<DateTime> GetLeaveDatesForEmployee(int employeeId, DateTime startDate, DateTime endDate)
        {
            return leaveRepository.GetLeaveDatesForEmployee(employeeId, startDate, endDate);
        }

        public async Task UpdateLeave(Leave leave)
        {
            if (leave.LeaveType == Database.Enums.LeaveType.Holidays)
            {
                var contextEmployee = employeeService.GetEmployeeById(leave.Employee.Id);
                if (contextEmployee == null)
                {
                    return;
                }
                var previousLeave = leaveRepository.GetLeaveById(leave.Id);
                var previousTotalDays = Helper.GetRangeOfDates(0, previousLeave.FromDate.Date, previousLeave.ToDate.Date)
                    .Where(d => d.DayOfWeek != DayOfWeek.Saturday && d.DayOfWeek != DayOfWeek.Sunday)
                    .ToList()
                    .Count;
                var vacationDaysWithoutPreviousLeaveDates = contextEmployee.VacationDays + previousTotalDays;

                var totalDays = Helper.GetRangeOfDates(0, leave.FromDate.Date, leave.ToDate.Date)
                    .Where(d => d.DayOfWeek != DayOfWeek.Saturday && d.DayOfWeek != DayOfWeek.Sunday)
                    .ToList()
                    .Count;
                var newVacationDaysTotal = vacationDaysWithoutPreviousLeaveDates - totalDays;

                await employeeService.UpdateEmployeeVacationDays(contextEmployee, newVacationDaysTotal);
            }

            await leaveRepository.UpdateLeave(leave);

        }

        public async Task DeleteLeave(int leaveId)
        {
            await leaveRepository.DeleteLeave(leaveId);
        }
    }
}
