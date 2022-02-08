namespace SuperSchedule.Database.Models
{
    public class Location
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Abbreviation { get; set; }

        public ICollection<ShiftType> ShiftTypes { get; set; } = new HashSet<ShiftType>();
    }
}
