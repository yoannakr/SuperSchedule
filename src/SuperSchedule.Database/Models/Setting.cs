namespace SuperSchedule.Database.Models
{
    public class Setting
    {
        public int Id { get; set; }

        public double NightWorkRate { get; set; }

        public int MaxHoursPerWeek { get; set; }

        public int MaxOvertimeHoursPerMonth { get; set; }

        public int MaxOvertimeHoursPerYear { get; set; }

        public ICollection<Holiday> Holidays { get; set; }
    }
}
