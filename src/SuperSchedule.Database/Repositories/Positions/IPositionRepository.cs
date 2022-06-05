using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Positions
{
    public interface IPositionRepository
    {
        Task CreatePosition(Position position);

        IEnumerable<Position> GetAllPositions();

        IEnumerable<Position> GetAllCurrentPositions();

        Position GetPositionById(int id);

        Task DeletePosition(int positionId);

        Task UpdatePosition(Position position);
    }
}
