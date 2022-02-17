using SuperSchedule.Database.Models;

namespace SuperSchedule.Startup.InputModels
{
    public class ShiftTypeInputModel
    {
        public string Name { get; set; }

        public string Abbreviation { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }

        public int RotationDays { get; set; }

        public Location Location { get; set; }
    }
}
