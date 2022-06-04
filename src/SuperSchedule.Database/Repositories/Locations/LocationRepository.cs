using Microsoft.EntityFrameworkCore;
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

        public async Task DeleteLocation(int locationId)
        {
            var contextLocation = superScheduleDbContext.Locations.FirstOrDefault(e => e.Id == locationId);
            if (contextLocation == null)
            {
                return;
            }

            contextLocation.IsDeleted = true;
            superScheduleDbContext.Locations.Update(contextLocation);

            await superScheduleDbContext.SaveChangesAsync();
        }

        public IEnumerable<Location> GetAllCurrentLocations()
        {
            return superScheduleDbContext.Locations.Where(l => !l.IsDeleted).ToList();
        }

        public IEnumerable<Location> GetAllLocations()
        {
            return superScheduleDbContext.Locations.ToList();
        }

        public Location GetLocationById(int id)
        {
            return superScheduleDbContext.Locations.FirstOrDefault(location => location.Id == id);
        }

        public async Task UpdateLocation(Location location)
        {
            var contextLocation = superScheduleDbContext.Locations.FirstOrDefault(e => e.Id == location.Id);
            if (contextLocation == null)
            {
                return;
            }

            contextLocation.Name = location.Name;
            contextLocation.Abbreviation = location.Abbreviation;
            contextLocation.Priority = location.Priority;
            contextLocation.ShiftTypesTemplate = location.ShiftTypesTemplate;

            superScheduleDbContext.Locations.Update(contextLocation);
            await superScheduleDbContext.SaveChangesAsync();
        }
    }
}
