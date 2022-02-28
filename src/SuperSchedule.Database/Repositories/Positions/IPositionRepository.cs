using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Positions
{
    public interface IPositionRepository
    {
        Task CreatePosition(Position position);

        IEnumerable<Position> GetAllPositions();

        Position GetPositionById(int id);
    }
}
