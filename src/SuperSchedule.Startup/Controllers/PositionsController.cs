using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Database.Models;
using SuperSchedule.Services.Positions;
using SuperSchedule.Startup.Models;

namespace SuperSchedule.Startup.Controllers
{
    public class PositionsController : ApiController
    {
        private readonly IPositionService positionService;

        public PositionsController(IPositionService positionService)
        {
            this.positionService = positionService;
        }

        [HttpGet]
        public IEnumerable<Position> GetAllPositions()
        {
            return positionService.GetAllPositions();
        }

        [HttpGet]
        public IEnumerable<Position> GetAllCurrentPositions()
        {
            return positionService.GetAllCurrentPositions();
        }

        [HttpPost]
        public async Task CreatePosition([FromBody] PositionModel positionModel)
        {
            await positionService.CreatePosition(new Position
            {
                Name = positionModel.Name,
                Abbreviation = positionModel.Abbreviation,
                Priority = positionModel.Priority
            });
        }

        [HttpDelete]
        public async Task DeletePosition(int positionId)
        {
            await positionService.DeletePosition(positionId);
        }

        [HttpPost]
        public async Task UpdatePosition(PositionModel positionInputModel)
        {
            await positionService.UpdatePosition(new Position
            {
                Id = positionInputModel.Id,
                Name = positionInputModel.Name,
                Abbreviation = positionInputModel.Abbreviation,
                Priority = positionInputModel.Priority
            });
        }
    }
}
