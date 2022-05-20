namespace SuperSchedule.Database.Models
{
    public class Employee
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public int VacationDays { get; set; }

        public Position Position { get; set; }

        public ICollection<Location> Locations { get; set; } = new HashSet<Location>();

        public ICollection<ShiftType> ShiftTypes { get; set; } = new HashSet<ShiftType>();
        
        public ICollection<Leave> Leaves { get; set; } = new HashSet<Leave>();
    }
}
