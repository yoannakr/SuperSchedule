using SuperSchedule.Database.Data;
using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Locations
{
    public class LocationRepository : ILocationRepository
    {
        private readonly SuperScheduleDbContext superScheduleDbContext;

        public LocationRepository(SuperScheduleDbContext superScheduleDbContext)
        {
            this.superScheduleDbContext = superScheduleDbContext;
        }

        public async Task CrateLocation(Location location)
        {
            superScheduleDbContext.Locations.Add(location);

            await superScheduleDbContext.SaveChangesAsync();
        }

        public IEnumerable<Location> GetAllLocations()
        {
            return superScheduleDbContext.Locations.ToList();
        }

        public Location GetLocationById(int id)
        {
            return superScheduleDbContext.Locations.First(location => location.Id == id);
        }
    }
}
