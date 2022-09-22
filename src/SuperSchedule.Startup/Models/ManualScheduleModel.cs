namespace SuperSchedule.Startup.Models
{
    public class ManualScheduleModel
    {
        public int LocationId { get; set; }

        public int EmployeeId { get; set; }

        public int ShiftTypeId { get; set; }

        public int RemovedShiftTypeId { get; set; }

        public DateTime Date { get; set; }

        public int LastRotationDays { get; set; }

        public int DayOfWeekTemplate { get; set; }
    }
}
