namespace SuperSchedule.Startup.Models
{
    public class LeaveModel
    {
        public int Id { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int LeaveTypeId { get; set; }

        public string Comment { get; set; }

        public int EmployeeId { get; set; }
    }
}
