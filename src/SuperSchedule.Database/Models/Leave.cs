using SuperSchedule.Database.Enums;

namespace SuperSchedule.Database.Models
{
    public class Leave
    {
        public int Id { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public LeaveType LeaveType { get; set; }

        public string Comment { get; set; }

        public Employee Employee { get; set; }
    }
}
