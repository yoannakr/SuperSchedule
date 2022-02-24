using SuperSchedule.Database.Models;
using SuperSchedule.Database.Repositories.Locations;

namespace SuperSchedule.Services.Locations
{
    public class LocationService : ILocationService
    {
        private readonly ILocationRepository locationRepository;

        public LocationService(ILocationRepository locationRepository)
        {
            this.locationRepository = locationRepository;
        }

        public async Task CrateLocation(Location location)
        {
            await locationRepository.CrateLocation(location);
        }

        public IEnumerable<Location> GetAllLocations()
        {
            return locationRepository.GetAllLocations();
        }

        public Location GetLocationById(int id)
        {
            return locationRepository.GetLocationById(id);
        }
    }
}
