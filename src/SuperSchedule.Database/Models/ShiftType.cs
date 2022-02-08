namespace SuperSchedule.Database.Models
{
    public class ShiftType
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Abbreviation { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }

        public int RotationDays { get; set; }

        public Location Location { get; set; }

        public ICollection<Day> Days { get; set; } = new HashSet<Day>();
    }
}
