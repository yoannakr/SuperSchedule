using SuperSchedule.Database.Models;
using SuperSchedule.Database.Repositories.ShiftTypes;

namespace SuperSchedule.Services.ShiftTypes
{
    public class ShiftTypeService : IShiftTypeService
    {
        private readonly IShiftTypeRepository _shiftTypeRepository;

        public ShiftTypeService(IShiftTypeRepository shiftTypeRepository)
        {
            _shiftTypeRepository = shiftTypeRepository;
        }

        public async Task CrateShiftType(ShiftType shiftType)
        {
            await _shiftTypeRepository.CrateShiftType(shiftType);
        }

        public IEnumerable<ShiftType> GetAllShiftTypes()
        {
            return _shiftTypeRepository.GetAllShiftTypes().ToList();
        }
    }
}
