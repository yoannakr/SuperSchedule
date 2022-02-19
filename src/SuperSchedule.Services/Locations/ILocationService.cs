using SuperSchedule.Database.Models;

namespace SuperSchedule.Services.Locations
{
    public interface ILocationService
    {
        Task CrateLocation(Location location);

        IEnumerable<Location> GetAllLocations();

        Location GetLocationById(int id);
    }
}
