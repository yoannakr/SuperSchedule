using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Services.Report;
using SuperSchedule.Startup.Models;
using System.Collections.Generic;

namespace SuperSchedule.Startup.Controllers
{
    public class ReportController : ApiController
    {
        private readonly IReportService reportService;

        public ReportController(IReportService reportService)
        {
            this.reportService = reportService;
        }

        [HttpGet]
        public IEnumerable<ReportModel> GetReport(DateTime fromMonth, DateTime toMonth)
        {
            return reportService.GetReport(fromMonth, toMonth).Select(r =>
           new ReportModel
           {
               Id = r.Id,
               FullName = r.FullName,
               ReportMonths = r.ReportMonths.Select(m => new ReportEmployeeMonthModel
               {
                   Id = m.Id,
                   OvertimeHours = m.OvertimeHours == 0 ? "-" : $"{m.OvertimeHours}"
               }),
               Result = r.Result == 0 ? "-" : $"{r.Result}"
           }).OrderBy(r=> r.Id);
        }

        [HttpGet]
        public IEnumerable<ReportMonthModel> GetReportMonths(DateTime fromMonth, DateTime toMonth)
        {
            return reportService.GetReportMonths(fromMonth, toMonth).Select(r =>
           new ReportMonthModel
           {
               Id = r.Id,
               Name = r.Name,
               MonthWorkingHours = r.MonthWorkingHours
           }).OrderBy(r => r.Id);
        }
    }
}
