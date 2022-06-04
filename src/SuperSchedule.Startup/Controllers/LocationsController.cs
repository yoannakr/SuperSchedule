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
        public IEnumerable<LocationModel> GetAllLocations()
        {
            return locationService.GetAllLocations().Select(l => new LocationModel
            {
                Id = l.Id,
                Name = l.Name,
                Abbreviation = l.Abbreviation,
                Priority = l.Priority,
                ShiftTypesTemplate = (int)l.ShiftTypesTemplate,
                ShiftTypesTemplateName = l.ShiftTypesTemplate.GetDisplayName()
            }).OrderBy(l => l.Priority);
        }

        [HttpGet]
        public IEnumerable<LocationModel> GetAllCurrentLocations()
        {
            return locationService.GetAllCurrentLocations().Select(l => new LocationModel
            {
                Id = l.Id,
                Name = l.Name,
                Abbreviation = l.Abbreviation,
                Priority = l.Priority,
                ShiftTypesTemplate = (int)l.ShiftTypesTemplate,
                ShiftTypesTemplateName = l.ShiftTypesTemplate.GetDisplayName()
            }).OrderBy(l => l.Priority);
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

        [HttpDelete]
        public async Task DeleteLocation(int locationId)
        {
            await locationService.DeleteLocation(locationId);
        }

        [HttpPost]
        public async Task UpdateLocation([FromBody] LocationModel locationModel)
        {
            await locationService.UpdateLocation(new Location
            {
                Id = locationModel.Id,
                Name = locationModel.Name,
                Abbreviation = locationModel.Abbreviation,
                Priority = locationModel.Priority,
                ShiftTypesTemplate = (ShiftTypesTemplate)locationModel.ShiftTypesTemplate,
            });
        }
    }
}
