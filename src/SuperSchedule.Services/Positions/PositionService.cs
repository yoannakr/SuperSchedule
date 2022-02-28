﻿using SuperSchedule.Database.Models;
using SuperSchedule.Database.Repositories.Positions;

namespace SuperSchedule.Services.Positions
{
    public class PositionService : IPositionService
    {
        private readonly IPositionRepository positionRepository;

        public PositionService(IPositionRepository positionRepository)
        {
            this.positionRepository = positionRepository;
        }

        public Task CreatePosition(Position position)
        {
            return positionRepository.CreatePosition(position);
        }

        public IEnumerable<Position> GetAllPositions()
        {
            return positionRepository.GetAllPositions();
        }

        public Position GetPositionById(int id)
        {
            return positionRepository.GetPositionById(id);
        }
    }
}
