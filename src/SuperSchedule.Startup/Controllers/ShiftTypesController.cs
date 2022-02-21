using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Database.Models;
using SuperSchedule.Services.Locations;
using SuperSchedule.Services.ShiftTypes;
using SuperSchedule.Startup.Models;

namespace SuperSchedule.Startup.Controllers
{
    public class ShiftTypesController : ApiController
    {
        private readonly IShiftTypeService _shiftTypeService;
        private readonly ILocationService _locationService;

        public ShiftTypesController(IShiftTypeService shiftTypeService, ILocationService locationService)
        {
            _shiftTypeService = shiftTypeService;
            _locationService = locationService;
        }

        [HttpGet]
        public IEnumerable<ShiftTypeModel> GetAllShiftTypes()
        {
            return _shiftTypeService.GetAllShiftTypes().Select(sh =>
                new ShiftTypeModel
                {
                    Name = sh.Name,
                    Abbreviation = sh.Abbreviation,
                    StartTime = new DateTime(sh.StartTime.Ticks),
                    EndTime = new DateTime(sh.EndTime.Ticks),
                    LocationId = sh.Location.Id
                });
        }

        [HttpPost]
        public async Task CreateShiftType([FromBody] ShiftTypeModel shiftTypeInputModel)
        {
            await _shiftTypeService.CrateShiftType(new ShiftType
            {
                Name = shiftTypeInputModel.Name,
                Abbreviation = shiftTypeInputModel.Abbreviation,
                StartTime = TimeOnly.FromDateTime(shiftTypeInputModel.StartTime),
                EndTime = TimeOnly.FromDateTime(shiftTypeInputModel.EndTime),
                RotationDays = shiftTypeInputModel.RotationDays,
                Location = _locationService.GetLocationById(shiftTypeInputModel.LocationId)
            });
        }
    }
}
