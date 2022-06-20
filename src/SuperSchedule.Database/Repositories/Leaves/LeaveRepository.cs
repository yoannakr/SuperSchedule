using Microsoft.EntityFrameworkCore;
using SuperSchedule.Database.Common;
using SuperSchedule.Database.Data;
using SuperSchedule.Database.Enums;
using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Leaves
{
    public class LeaveRepository : ILeaveRepository
    {
        private readonly SuperScheduleDbContext superScheduleDbContext;

        public LeaveRepository(SuperScheduleDbContext superScheduleDbContext)
        {
            this.superScheduleDbContext = superScheduleDbContext;
        }

        public async Task CreateLeave(Leave leave)
        {
            superScheduleDbContext.Leaves.Add(leave);

            await superScheduleDbContext.SaveChangesAsync();
        }

        public IEnumerable<Leave> GetLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate)
        {
            return superScheduleDbContext
                .Leaves
                .Where(l => l.LeaveType == LeaveType.Holidays && l.Employee.Id == employeeId &&
                (startDate.Date <= l.ToDate.Date && endDate.Date >= l.FromDate.Date));
        }

        public IEnumerable<Leave> GetAllLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate)
        {
            return superScheduleDbContext
                .Leaves
                .Where(l => l.Employee.Id == employeeId &&
                (startDate.Date <= l.ToDate.Date && endDate.Date >= l.FromDate.Date));
        }

        public IEnumerable<Leave> GetSickLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate)
        {
            return superScheduleDbContext
               .Leaves
               .Where(l => l.LeaveType == LeaveType.SickLeave && l.Employee.Id == employeeId &&
               (startDate.Date <= l.ToDate.Date && endDate.Date >= l.FromDate.Date));
        }

        public bool IsEmployeeHasLeavesForDate(int employeeId, DateTime date)
        {
            return superScheduleDbContext
                .Leaves
                .Any(l => l.LeaveType == LeaveType.Holidays && l.Employee.Id == employeeId &&
                (date.Date >= l.ToDate.Date && date.Date <= l.FromDate.Date));
        }

        public bool IsEmployeeHasSickLeavesForDate(int employeeId, DateTime date)
        {
            return superScheduleDbContext
                .Leaves
                .Any(l => l.LeaveType == LeaveType.SickLeave && l.Employee.Id == employeeId &&
                (date.Date >= l.ToDate.Date && date.Date <= l.FromDate.Date));
        }

        public bool IsEmployeeHasLeavesForPeriod(int employeeId, DateTime startDate, DateTime endDate)
        {
            return superScheduleDbContext
                .Leaves
                .Any(l => l.LeaveType == LeaveType.Holidays && l.Employee.Id == employeeId &&
                (startDate.Date <= l.ToDate.Date && endDate.Date >= l.FromDate.Date));
        }

        public bool IsEmployeeHasSickLeavesForPeriod(int employeeId, DateTime startDate, DateTime endDate)
        {
            return superScheduleDbContext
                .Leaves
                .Any(l => l.LeaveType == LeaveType.SickLeave && l.Employee.Id == employeeId &&
                (startDate.Date <= l.ToDate.Date && endDate.Date >= l.FromDate.Date));
        }

        public IEnumerable<DateTime> GetLeaveDatesForEmployee(int employeeId, DateTime startDate, DateTime endDate)
        {
            var dates = new List<DateTime>();
            var leaves = GetAllLeavesForEmployee(employeeId, startDate, endDate);
            foreach (var leave in leaves)
            {
                var leaveDates = Helper.GetRangeOfDates(0, leave.FromDate.Date, leave.ToDate.Date);
                dates.AddRange(leaveDates);
            }

            return dates.Distinct();
        }

        public async Task UpdateLeave(Leave leave)
        {
            var contextLeave = superScheduleDbContext.Leaves.FirstOrDefault(e => e.Id == leave.Id);
            if (contextLeave == null)
            {
                return;
            }

            contextLeave.FromDate = leave.FromDate;
            contextLeave.ToDate = leave.ToDate;
            contextLeave.LeaveType = leave.LeaveType;
            contextLeave.Comment = leave.Comment;

            superScheduleDbContext.Leaves.Update(contextLeave);
            await superScheduleDbContext.SaveChangesAsync();
        }

        public async Task DeleteLeave(int leaveId)
        {
            var contextLeave = superScheduleDbContext.Leaves.FirstOrDefault(e => e.Id == leaveId);
            if (contextLeave == null)
            {
                return;
            }

            superScheduleDbContext.Leaves.Remove(contextLeave);
            await superScheduleDbContext.SaveChangesAsync();
        }

        public bool HasAnyLeavesInPeriod(Leave leave)
        {
            var leaveDates = Helper.GetRangeOfDates(0, leave.FromDate.Date, leave.ToDate.Date);
            var allLeaveDates = superScheduleDbContext
                .Leaves
                .ToList()
                .SelectMany(l => Helper.GetRangeOfDates(0, l.FromDate.Date, l.ToDate.Date));

            return allLeaveDates.Any(d => leaveDates.Any(leaveDate => leaveDate.Date == d.Date));
        }

        public Leave GetLeaveById(int id)
        {
            return superScheduleDbContext.Leaves.FirstOrDefault(l => l.Id == id);   
        }
    }
}
