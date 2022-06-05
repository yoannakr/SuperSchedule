using System.Collections.Generic;

namespace SuperSchedule.Services.Report
{
    public interface IReportService
    {
        IEnumerable<Models.Report> GetReport(DateTime fromMonth, DateTime toMonth);
        
        IEnumerable<Models.ReportMonth> GetReportMonths(DateTime fromMonth, DateTime toMonth);
    }
}
