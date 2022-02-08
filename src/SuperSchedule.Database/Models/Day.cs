namespace SuperSchedule.Database.Models
{
    public class Day
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public ICollection<ShiftType> ShiftTypes { get; set; } = new HashSet<ShiftType>();
    }
}
