using SuperSchedule.Database.Common;
using SuperSchedule.Services.Employees;
using SuperSchedule.Services.Models;
using SuperSchedule.Services.Schedules;

namespace SuperSchedule.Services.Report
{
    public class ReportService : IReportService
    {
        private readonly IEmployeeService employeeService;
        private readonly IScheduleService scheduleService;

        public ReportService(IEmployeeService employeeService, IScheduleService scheduleService)
        {
            this.employeeService = employeeService;
            this.scheduleService = scheduleService;
        }

        public IEnumerable<Models.Report> GetReport(DateTime fromMonth, DateTime toMonth)
        {
            var report = new List<Models.Report>();
            var firstDayOfFromMonth = new DateTime(fromMonth.Year, fromMonth.Month, 1);
            var employees = employeeService.GetAllEmployees().Where(e => e.IsDeleted ? e.DateOfDeletion.GetValueOrDefault().Date > firstDayOfFromMonth.Date : true);
            var reportMonths = Helper.GetMonthsBetween(fromMonth, toMonth.AddMonths(1));

            foreach (var employee in employees)
            {
                var reportEmployeeMonths = new List<ReportEmployeeMonth>();
                foreach (var month in reportMonths)
                {
                    var firstDayOfMonth = new DateTime(month.Year, month.Month, 1);
                    var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
                    var overTimeWorkingHours = scheduleService.GetOverWorkingHoursForMonth(employee, firstDayOfMonth, lastDayOfMonth);

                    reportEmployeeMonths.Add(new ReportEmployeeMonth
                    {
                        Id = month.Month,
                        OvertimeHours = Math.Round(overTimeWorkingHours,2)
                    });
                }
                var result = reportEmployeeMonths.Sum(m => m.OvertimeHours);
                report.Add(new Models.Report
                {
                    Id = report.Count + 1,
                    FullName = employee.FullName,
                    ReportMonths = reportEmployeeMonths,
                    Result = Math.Round(result, 2)
                });
            }

            return report;
        }

        public IEnumerable<ReportMonth> GetReportMonths(DateTime fromMonth, DateTime toMonth)
        {
            var resultReportMonths = new List<ReportMonth>();
            var reportMonths = Helper.GetMonthsBetween(fromMonth, toMonth.AddMonths(1));
            foreach (var month in reportMonths)
            {
                var monthWorkingDays = scheduleService.CalculateWorkingHoursForMonth(month);
                var name = $"{month.Month}*{month.Year}";

                resultReportMonths.Add(new ReportMonth
                {
                    Id = month.Month,
                    Name = name,
                    MonthWorkingHours = monthWorkingDays
                });
            }

            return resultReportMonths;
        }
    }
}
