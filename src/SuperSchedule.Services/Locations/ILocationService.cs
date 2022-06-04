using SuperSchedule.Database.Models;

namespace SuperSchedule.Services.Locations
{
    public interface ILocationService
    {
        Task CrateLocation(Location location);

        IEnumerable<Location> GetAllLocations();

        Location GetLocationById(int id);

        Task DeleteLocation(int locationId);

        Task UpdateLocation(Location location);

        IEnumerable<Location> GetAllCurrentLocations();
    }
}
