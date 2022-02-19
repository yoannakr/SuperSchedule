using SuperSchedule.Database.Models;
using SuperSchedule.Database.Repositories.Locations;

namespace SuperSchedule.Services.Locations
{
    public class LocationService : ILocationService
    {
        private readonly ILocationRepository _locationRepository;

        public LocationService(ILocationRepository locationRepository)
        {
            _locationRepository = locationRepository;
        }

        public async Task CrateLocation(Location location)
        {
            await _locationRepository.CrateLocation(location);
        }

        public IEnumerable<Location> GetAllLocations()
        {
            return _locationRepository.GetAllLocations();
        }

        public Location GetLocationById(int id)
        {
            return _locationRepository.GetLocationById(id);
        }
    }
}
