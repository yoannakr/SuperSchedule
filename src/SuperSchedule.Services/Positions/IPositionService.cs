using SuperSchedule.Database.Models;

namespace SuperSchedule.Services.Positions
{
    public interface IPositionService
    {
        Task CreatePosition(Position position);

        IEnumerable<Position> GetAllPositions();

        Position GetPositionById(int id);

        Task DeletePosition(int positionId);

        Task UpdatePosition(Position position);
    }
}
