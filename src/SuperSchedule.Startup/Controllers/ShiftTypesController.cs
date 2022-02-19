using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Database.Models;
using SuperSchedule.Services.Locations;
using SuperSchedule.Services.ShiftTypes;
using SuperSchedule.Startup.InputModels;

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
        public IEnumerable<ShiftType> GetAllShiftTypes()
        {
            return _shiftTypeService.GetAllShiftTypes();
        }

        [HttpPost]
        public async Task CreateShiftType([FromBody] ShiftTypeInputModel shiftTypeInputModel)
        {
            await _shiftTypeService.CrateShiftType(new ShiftType
            {
                Name = shiftTypeInputModel.Name,
                Abbreviation = shiftTypeInputModel.Abbreviation,
                StartTime = shiftTypeInputModel.StartTime,
                EndTime = shiftTypeInputModel.EndTime,
                RotationDays = shiftTypeInputModel.RotationDays,
                Location = _locationService.GetLocationById(shiftTypeInputModel.LocationId)
            });
        }
    }
}
