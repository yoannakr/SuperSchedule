using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Database.Models;
using SuperSchedule.Services.Days;
using SuperSchedule.Services.Locations;
using SuperSchedule.Services.ShiftTypes;
using SuperSchedule.Startup.Models;

namespace SuperSchedule.Startup.Controllers
{
    public class ShiftTypesController : ApiController
    {
        private readonly ILogger<ShiftTypesController> logger;
        private readonly IShiftTypeService shiftTypeService;
        private readonly ILocationService locationService;
        private readonly IDayService dayService;

        public ShiftTypesController(ILogger<ShiftTypesController> logger, IShiftTypeService shiftTypeService, ILocationService locationService, IDayService dayService)
        {
            this.logger = logger;
            this.shiftTypeService = shiftTypeService;
            this.locationService = locationService;
            this.dayService = dayService;
        }

        [HttpGet]
        public IEnumerable<ShiftTypeModel> GetAllShiftTypes()
        {
            return shiftTypeService.GetAllShiftTypes().Select(sh =>
                new ShiftTypeModel
                {
                    Id = sh.Id,
                    Name = sh.Name,
                    Abbreviation = sh.Abbreviation,
                    StartTime = new DateTime(sh.StartTime.Ticks),
                    EndTime = new DateTime(sh.EndTime.Ticks),
                    RotationDays = sh.RotationDays,
                    Priority = sh.Priority,
                    LocationId = sh.Location?.Id ?? 0,
                    DaysIds = sh.Days.Select(d => d.Id)
                });
        }

        [HttpPost]
        public async Task CreateShiftType([FromBody] ShiftTypeModel shiftTypeInputModel)
        {
            logger.LogInformation("Creating Shift Type started..");

            await shiftTypeService.CrateShiftType(new ShiftType
            {
                Name = shiftTypeInputModel.Name,
                Abbreviation = shiftTypeInputModel.Abbreviation,
                StartTime = TimeOnly.FromDateTime(shiftTypeInputModel.StartTime.ToLocalTime()),
                EndTime = TimeOnly.FromDateTime(shiftTypeInputModel.EndTime.ToLocalTime()),
                RotationDays = shiftTypeInputModel.RotationDays,
                Priority = shiftTypeInputModel.Priority,
                Location = locationService.GetLocationById(shiftTypeInputModel.LocationId),
                NightHours = shiftTypeInputModel.NightHours,
                Days = shiftTypeInputModel.DaysIds.Select(id => dayService.GetDayById(id)).ToList()
            }) ;

            logger.LogInformation("Created Shift Type");
        }

        [HttpGet]
        public IEnumerable<ShiftTypeModel> GetShiftTypesByLocation(int locationId)
        {
            return shiftTypeService.GetShiftTypesByLocation(locationId).Select(sh =>
                new ShiftTypeModel
                {
                    Id = sh.Id,
                    Name = sh.Name,
                    Abbreviation = sh.Abbreviation,
                    StartTime = new DateTime(sh.StartTime.Ticks),
                    EndTime = new DateTime(sh.EndTime.Ticks),
                    RotationDays = sh.RotationDays,
                    LocationId = sh.Location?.Id ?? 0,
                    DaysIds = sh.Days.Select(d => d.Id)
                });
        }

        [HttpGet]
        public IEnumerable<ShiftTypeModel> GetShiftTypesByLocationIncludingDefaultBreak(int locationId)
        {
            return shiftTypeService.GetShiftTypesByLocationIncludingDefaultBreak(locationId).Select(sh =>
                new ShiftTypeModel
                {
                    Id = sh.Id,
                    Name = sh.Name,
                    Abbreviation = sh.Abbreviation,
                    StartTime = new DateTime(sh.StartTime.Ticks),
                    EndTime = new DateTime(sh.EndTime.Ticks),
                    RotationDays = sh.RotationDays,
                    Priority = sh.Priority,
                    LocationId = sh.Location?.Id ?? 0,
                    DaysIds = sh.Days.Select(d => d.Id)
                });
        }
    }
}
