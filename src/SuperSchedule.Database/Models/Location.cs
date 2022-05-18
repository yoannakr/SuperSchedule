using SuperSchedule.Database.Enums;

namespace SuperSchedule.Database.Models
{
    public class Location
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Abbreviation { get; set; }

        public int Priority { get; set; }

        public ShiftTypesTemplate ShiftTypesTemplate { get; set; } = ShiftTypesTemplate.TwelveHours;

        public ICollection<ShiftType> ShiftTypes { get; set; } = new HashSet<ShiftType>();

        public ICollection<Employee> Employees { get; set; } = new HashSet<Employee>();
    }
}
