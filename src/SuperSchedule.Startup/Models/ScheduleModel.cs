namespace SuperSchedule.Startup.Models
{
    public class ScheduleModel
    {
        public int Id { get; set; }

        public EmployeeModel Employee { get; set; }

        public IEnumerable<ShiftTypeEditableCellModel> ShiftTypeEditableCells { get; set; }
    }
}
