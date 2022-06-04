using System.ComponentModel.DataAnnotations;

namespace SuperSchedule.Database.Enums
{
    public enum Role
    {
        [Display(Name = "Администратор")]
        Administrator = 1,
        [Display(Name = "Редактор")]
        Editor = 2
    }
}
