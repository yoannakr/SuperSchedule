using SuperSchedule.Database.Enums;

namespace SuperSchedule.Startup.Models
{
    public class LocationModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Abbreviation { get; set; }

        public int Priority { get; set; }

        public int ShiftTypesTemplate { get; set; }

        public bool IsAutomationFill { get; set; } 

        public string? ShiftTypesTemplateName { get; set; }
       
        public bool IsDeleted { get; set; }
    }
}
