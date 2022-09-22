using System.ComponentModel.DataAnnotations;

namespace SuperSchedule.Database.Enums
{
    public enum DayOfWeekTemplate
    {
        [Display(Name = "Понеделник и Вторник")]
        MondayAndTuesday = 1,
        [Display(Name = "Петък и Събота")]
        FridayAndSaturday = 2
    }
}
