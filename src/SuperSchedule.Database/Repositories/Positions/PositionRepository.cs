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

        public async Task DeletePosition(int positionId)
        {
            var contextPosition = superScheduleDbContext.Positions.FirstOrDefault(e => e.Id == positionId);
            if (contextPosition == null)
            {
                return;
            }

            superScheduleDbContext.Positions.Remove(contextPosition);

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

        public async Task UpdatePosition(Position position)
        {
            var contextPosition = superScheduleDbContext.Positions.FirstOrDefault(e => e.Id == position.Id);
            if (contextPosition == null)
            {
                return;
            }

            contextPosition.Name = position.Name;
            contextPosition.Abbreviation = position.Abbreviation;
            contextPosition.Priority = position.Priority;

            superScheduleDbContext.Positions.Update(contextPosition);
            await superScheduleDbContext.SaveChangesAsync();
        }
    }
}
