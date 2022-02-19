using SuperSchedule.Database.Data;
using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Locations
{
    public class LocationRepository : ILocationRepository
    {
        private readonly SuperScheduleDbContext _superScheduleDbContext;

        public LocationRepository(SuperScheduleDbContext superScheduleDbContext)
        {
            _superScheduleDbContext = superScheduleDbContext;
        }

        public async Task CrateLocation(Location location)
        {
            _superScheduleDbContext.Locations.Add(location);

            await _superScheduleDbContext.SaveChangesAsync();
        }

        public IEnumerable<Location> GetAllLocations()
        {
            return _superScheduleDbContext.Locations.ToList();
        }

        public Location GetLocationById(int id)
        {
            return _superScheduleDbContext.Locations.First(location => location.Id == id);
        }
    }
}
