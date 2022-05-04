using SuperSchedule.Database.Models;

namespace SuperSchedule.Startup.Models
{
    public class ShiftTypeModel
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Abbreviation { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public int RotationDays { get; set; }

        public int LocationId { get; set; }

        public IEnumerable<int>? DaysIds { get; set; }
    }
}
