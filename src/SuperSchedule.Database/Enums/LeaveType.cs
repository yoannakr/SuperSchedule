using System.ComponentModel.DataAnnotations;

namespace SuperSchedule.Database.Enums
{
    public enum LeaveType
    {
        [Display(Name = "Отпуска")]
        Holidays = 1,
        [Display(Name = "Болничен")]
        SickLeave = 2
    }
}
