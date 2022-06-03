using System.ComponentModel.DataAnnotations.Schema;

namespace SuperSchedule.Database.Models
{
    public class ShiftType
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Abbreviation { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }

        [NotMapped]
        public double TotalHours => Math.Abs(EndTime.Hour - StartTime.Hour) + (((NightHours * 1.143) - NightHours) ?? 0);

        public int RotationDays { get; set; }

        public int? NightHours { get; set; }

        public int Priority { get; set; }

        public bool IsDeleted { get; set; }

        public Location? Location { get; set; }

        public ICollection<Day> Days { get; set; } = new HashSet<Day>();

        public ICollection<Employee> Employees { get; set; } = new HashSet<Employee>();
    }
}
