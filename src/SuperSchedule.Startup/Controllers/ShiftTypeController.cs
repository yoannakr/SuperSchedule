using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Database.Models;
using SuperSchedule.Services.ShiftTypes;
using SuperSchedule.Startup.InputModels;

namespace SuperSchedule.Startup.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ShiftTypeController : ControllerBase
    {
        private readonly IShiftTypeService _shiftTypeService;

        public ShiftTypeController(IShiftTypeService shiftTypeService)
        {
            _shiftTypeService = shiftTypeService;
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
                Location = shiftTypeInputModel.Location
            });
        }
    }
}
