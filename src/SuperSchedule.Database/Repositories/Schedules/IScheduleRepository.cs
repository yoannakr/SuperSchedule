﻿using SuperSchedule.Database.Enums;
using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Schedules
{
    public interface IScheduleRepository
    {
        Task CreateSchedule(Schedule schedule);

        Task CreateSchedule(IEnumerable<Schedule> schedules);

        IEnumerable<Schedule> GetSchedulesByLocationForPeriod(int locationId, DateTime startDate, DateTime endDate);

        Schedule GetScheduleById(int scheduleId);

        Task UpdateShiftTypeOfSchedules(Schedule schedule, int newShiftTypeId);

        Schedule GetEmployeeScheduleByLocationForDate(int locationId, DateTime date, Employee employee);

        IEnumerable<Schedule> GetEmployeeSchedulesForDate(DateTime date, Employee employee);

        bool IsScheduleFilledForPreviousMonth(int locationId, DateTime date);

        bool IsEmployeeAvailable(DateTime date, Employee employee);

        DayOfWeekTemplate? GetDayOfWeekTemplateForMonth(int locationId, DateTime monthDate, Employee employee);

        IEnumerable<Schedule> GetEmployeeScheduleForPeriod(DateTime startDate, DateTime endDate, int employeeId);

        bool IsScheduleFilled(DateTime firstDayOfMonth, DateTime lastDayOfMonth);
       
        Task RemoveSchedulesForPeriod(DateTime startDate, DateTime endDate);

        bool IsScheduleExist(int employeeId, int locationId, DateTime date);

        Task UpdateSchedule(Schedule schedule);
    }
}
