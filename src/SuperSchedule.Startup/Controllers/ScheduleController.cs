using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Database.Models;
using SuperSchedule.Services.Schedules;
using SuperSchedule.Startup.Models;

namespace SuperSchedule.Startup.Controllers
{
    public class ScheduleController : ApiController
    {
        private readonly ILogger<ScheduleController> logger;
        private readonly IScheduleService scheduleService;

        public ScheduleController(IScheduleService scheduleService, ILogger<ScheduleController> logger)
        {
            this.scheduleService = scheduleService;
            this.logger = logger;
        }

        [HttpPost]
        public async Task FillSchedulesForMonth(DateTime startDate, DateTime endDate)
        {
            await scheduleService.FillSchedulesForMonth(startDate, endDate);
        }

        [HttpGet]
        public IEnumerable<ScheduleModel> GetSchedulesByLocationForPeriod(int locationId, DateTime startDate, DateTime endDate)
        {
            return scheduleService
                .GetSchedulesByLocationForPeriod(locationId, startDate, endDate)
                .GroupBy(g => g.Employee)
                .Select(g => new ScheduleModel
                {
                    Employee = new EmployeeModel
                    {
                        Id = g.Key.Id,
                        FirstName = g.Key.FirstName,
                        MiddleName = g.Key.MiddleName,
                        LastName = g.Key.LastName,
                    },
                    ShiftTypeEditableCells = g.Select(v => new ShiftTypeEditableCellModel
                    {
                        ScheduleId = v.Id,
                        ShiftType = new ShiftTypeModel
                        {
                            Id = v.ShiftType?.Id ?? 0,
                            Name = v.ShiftType?.Name ?? "",
                            Abbreviation = v.ShiftType?.Abbreviation ?? ""
                        }
                    }), 
                });         
        }

        [HttpPost]
        public async Task UpdateShiftTypeOfSchedules(List<ShiftTypeEditableCellModel> shiftTypeEditableCells)
        {
            var schedules = shiftTypeEditableCells.Select(s => new Schedule
            {
                Id = s.ScheduleId,
                ShiftType = s.ShiftType != null ? new ShiftType
                {
                    Id = s.ShiftType.Id
                } : null
            }).ToList();

            await scheduleService.UpdateShiftTypeOfSchedules(schedules);
        }
    }

}
