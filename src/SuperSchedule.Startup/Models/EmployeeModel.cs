namespace SuperSchedule.Startup.Models
{
    public class EmployeeModel
    {
        public int Id { get; set; }

        public string? FirstName { get; set; }

        public string? MiddleName { get; set; }

        public string? LastName { get; set; }

        public string? FullName { get; set; }

        public int VacationDays { get; set; }

        public int PositionId { get; set; }

        public bool IsDeleted { get; set; }

        public string? PositionName { get; set; }

        public IEnumerable<int>? LocationsIds { get; set; }

        public IEnumerable<int>? ShiftTypesIds { get; set; }
    }
}
