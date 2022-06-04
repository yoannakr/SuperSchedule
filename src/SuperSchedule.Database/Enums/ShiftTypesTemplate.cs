using System.ComponentModel.DataAnnotations;

namespace SuperSchedule.Database.Enums
{
    public enum ShiftTypesTemplate
    {
        [Display(Name = "12 часови смени")]
        TwelveHours  = 1,
        [Display(Name = "първа и втора смяна")]
        FirstAndSecondShifts = 2,
        [Display(Name = "една смяна")]
        OneShift = 3,
    }
}
