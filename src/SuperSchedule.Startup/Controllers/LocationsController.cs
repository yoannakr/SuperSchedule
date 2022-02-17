using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Database.Models;
using SuperSchedule.Services.Locations;
using SuperSchedule.Startup.InputModels;

namespace SuperSchedule.Startup.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class LocationsController : ControllerBase
    {
        private readonly ILocationService _locationService;

        public LocationsController(ILocationService locationService)
        {
            _locationService = locationService;
        }

        [HttpGet]
        public IEnumerable<Location> GetAllLocations()
        {
            return _locationService.GetAllLocations();
        }

        [HttpPost]
        public async Task CreateLocation([FromBody] LocationInputModel locationInputModel)
        {
            await _locationService.CrateLocation(new Location
            {
                Name = locationInputModel.Name,
                Abbreviation = locationInputModel.Abbreviation
            });
        }
    }
}
