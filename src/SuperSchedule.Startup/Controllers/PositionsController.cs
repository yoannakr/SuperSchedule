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

        [HttpPost]
        public async Task CreatePosition([FromBody] PositionModel positionModel)
        {
            await positionService.CreatePosition(new Position
            {
                Name = positionModel.Name,
                Abbreviation = positionModel.Abbreviation
            });
        }
    }
}
