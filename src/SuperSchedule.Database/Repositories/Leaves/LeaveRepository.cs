﻿using Microsoft.EntityFrameworkCore;
using SuperSchedule.Database.Data;
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
                .Where(l => l.Employee.Id == employeeId &&
                (startDate.Date <= l.ToDate.Date || endDate.Date >= l.FromDate.Date));
        }

        public bool IsEmployeeHasLeavesForDate(int employeeId, DateTime date)
        {
            return superScheduleDbContext
                .Leaves
                .Any(l => l.Employee.Id == employeeId &&
                (date.Date >= l.ToDate.Date && date.Date <= l.FromDate.Date));
        }

        public bool IsEmployeeHasLeavesForPeriod(int employeeId, DateTime startDate, DateTime endDate)
        {
            return superScheduleDbContext
                .Leaves
                .Any(l => l.Employee.Id == employeeId &&
                (startDate.Date <= l.ToDate.Date || endDate.Date >= l.FromDate.Date));
        }
    }
}