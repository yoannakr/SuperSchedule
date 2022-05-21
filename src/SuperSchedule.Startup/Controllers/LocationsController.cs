using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Database.Enums;
using SuperSchedule.Database.Models;
using SuperSchedule.Services.Locations;
using SuperSchedule.Startup.Models;

namespace SuperSchedule.Startup.Controllers
{
    public class LocationsController : ApiController
    {
        private readonly ILocationService locationService;

        public LocationsController(ILocationService locationService)
        {
            this.locationService = locationService;
        }

        [HttpGet]
        public IEnumerable<Location> GetAllLocations()
        {
            return locationService.GetAllLocations();
        }

        [HttpPost]
        public async Task CreateLocation([FromBody] LocationModel locationInputModel)
        {
            await locationService.CrateLocation(new Location
            {
                Name = locationInputModel.Name,
                Abbreviation = locationInputModel.Abbreviation,
                Priority = locationInputModel.Priority,
                ShiftTypesTemplate = (ShiftTypesTemplate)locationInputModel.ShiftTypesTemplate,
            });
        }
    }
}
