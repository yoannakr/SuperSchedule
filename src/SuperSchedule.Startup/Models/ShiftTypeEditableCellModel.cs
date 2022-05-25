namespace SuperSchedule.Startup.Models
{
    public class ShiftTypeEditableCellModel
    {
        public int ScheduleId { get; set; }

        public ShiftTypeModel? ShiftType { get; set; }

        public DateTime? Date { get; set; }

        public int? LocationId { get; set; }
    }
}
