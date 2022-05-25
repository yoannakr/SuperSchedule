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
        public async Task FillSchedulesForMonth(DateTime monthDate)
        {
            var firstDayOfMonth = new DateTime(monthDate.Year, monthDate.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            await scheduleService.FillSchedulesForMonth(firstDayOfMonth, lastDayOfMonth);
        }

        [HttpGet]
        public IEnumerable<string> GetErrorsForMonthSchedule(DateTime monthDate)
        {
            var firstDayOfMonth = new DateTime(monthDate.Year, monthDate.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            return scheduleService.GetErrorsForMonthSchedule(firstDayOfMonth, lastDayOfMonth);
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
                        ShiftTypesIds = g.Key.ShiftTypes.Select(s => s.Id).ToList()
                    },
                    ShiftTypeEditableCells = g.Select(v => new ShiftTypeEditableCellModel
                    {
                        ScheduleId = v.Id,
                        ShiftType = new ShiftTypeModel
                        {
                            Id = v.ShiftType?.Id ?? 0,
                            Name = v.ShiftType?.Name ?? "",
                            Abbreviation = v.ShiftType?.Abbreviation ?? ""
                        },
                        Date = v.Date,
                        LocationId = locationId
                    }),
                });
        }

        [HttpGet]
        public ScheduleModel GetPersonalSchedules(int employeeId, DateTime monthDate)
        {
            var firstDayOfMonth = new DateTime(monthDate.Year, monthDate.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
            var (employee, schedules) = scheduleService.GetPersonalSchedules(employeeId, firstDayOfMonth, lastDayOfMonth);

            return
                new ScheduleModel
                {
                    Employee = new EmployeeModel
                    {
                        Id = employee.Id,
                        FirstName = employee.FirstName,
                        MiddleName = employee.MiddleName,
                        LastName = employee.LastName,
                        ShiftTypesIds = employee.ShiftTypes.Select(s => s.Id).ToList()
                    },
                    ShiftTypeEditableCells = schedules.Select(s => new ShiftTypeEditableCellModel
                    {
                        ScheduleId = s.Id,
                        ShiftType = new ShiftTypeModel
                        {
                            Id = s.ShiftType?.Id ?? 0,
                            Name = s.ShiftType?.Name ?? "",
                            Abbreviation = s.ShiftType?.Abbreviation ?? "",
                            LocationId = s.ShiftType?.Location?.Id ?? 0
                        },
                        Date = s.Date
                    })
                };
        }

        //[HttpPost]
        //public async Task UpdateShiftTypeOfSchedules(List<ShiftTypeEditableCellModel> shiftTypeEditableCells)
        //{
        //    var schedules = shiftTypeEditableCells.Select(s => new Schedule
        //    {
        //        Id = s.ScheduleId,
        //        ShiftType = s.ShiftType != null ? new ShiftType
        //        {
        //            Id = s.ShiftType.Id
        //        } : null,
        //        Date = s.Date ?? DateTime.UtcNow
        //    }).ToList();

        //    await scheduleService.UpdateShiftTypeOfSchedules(schedules);
        //}

        [HttpPost]
        public async Task<ActionResult<IEnumerable<string>>> UpdateShiftTypeOfSchedules(List<ScheduleModel> scheduleModels)
        {
            if (scheduleModels == null || scheduleModels.Count == 0)
            {
                return new OkResult();
            }

            var schedules = scheduleModels.SelectMany(s => s.ShiftTypeEditableCells.Select(cell => new Schedule
            {
                Id = cell.ScheduleId,
                Employee = new Employee
                {
                    Id = s.Employee.Id
                },
                ShiftType = cell.ShiftType != null ? new ShiftType
                {
                    Id = cell.ShiftType.Id
                } : null,
                Date = cell.Date ?? DateTime.UtcNow,
                Location = new Location
                {
                    Id = cell.LocationId ?? 0
                }
            })).ToList();

            var (hasErrors, errorMessages) = await scheduleService.UpdateShiftTypeOfSchedules(schedules);

            if (hasErrors)
            {
                return new BadRequestObjectResult(errorMessages);
            }

            return new OkResult();
        }

        [HttpPost]
        public async Task UpdatePersonalScheduleShiftTypes(ScheduleModel scheduleModel)
        {
            if (scheduleModel == null)
            {
                return;
            }

            var schedules = scheduleModel.ShiftTypeEditableCells.Select(s => new Schedule
            {
                Id = s.ScheduleId,
                ShiftType = s.ShiftType != null ? new ShiftType
                {
                    Id = s.ShiftType.Id
                } : null,
                Date = s.Date ?? DateTime.UtcNow
            }).ToList();

            await scheduleService.UpdatePersonalScheduleShiftTypes(scheduleModel.Employee.Id, schedules);
        }
    }

}
