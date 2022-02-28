using SuperSchedule.Database.Data;
using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Positions
{
    public class PositionRepository : IPositionRepository
    {
        private readonly SuperScheduleDbContext superScheduleDbContext;

        public PositionRepository(SuperScheduleDbContext superScheduleDbContext)
        {
            this.superScheduleDbContext = superScheduleDbContext;
        }

        public async Task CreatePosition(Position position)
        {
            superScheduleDbContext.Positions.Add(position);

            await superScheduleDbContext.SaveChangesAsync();
        }

        public IEnumerable<Position> GetAllPositions()
        {
            return superScheduleDbContext.Positions.ToList();
        }

        public Position GetPositionById(int id)
        {
            return superScheduleDbContext.Positions.First(position => position.Id == id);
        }
    }
}
