namespace SuperSchedule.Services.Models
{
    public class Report
    {
        public int Id { get; set; }

        public string FullName { get; set; }

        public IEnumerable<ReportEmployeeMonth> ReportMonths { get; set; } 

        public double Result { get; set; } 
    }
}
