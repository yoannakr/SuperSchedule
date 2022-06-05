namespace SuperSchedule.Startup.Models
{
    public class ReportModel
    {
        public int Id { get; set; }

        public string FullName { get; set; }

        public IEnumerable<ReportEmployeeMonthModel> ReportMonths { get; set; } 

        public string Result { get; set; } 
    }
}
