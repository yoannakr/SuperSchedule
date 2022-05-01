namespace SuperSchedule.Startup.Models
{
    public class SettingModel
    {
        public int Id { get; set; }

        public double NightWorkRate { get; set; }

        public int MaxHoursPerWeek { get; set; }

        public int MaxOvertimeHoursPerMonth { get; set; }

        public int MaxOvertimeHoursPerYear { get; set; }

        public IEnumerable<HolidayModel> Holidays { get; set; }
    }
}
