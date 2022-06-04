using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Locations
{
    public interface ILocationRepository
    {
        Task CrateLocation(Location location);

        IEnumerable<Location> GetAllLocations();

        Location GetLocationById(int id);

        Task DeleteLocation(int locationId);

        Task UpdateLocation(Location location);

        IEnumerable<Location> GetAllCurrentLocations();
    }
}

