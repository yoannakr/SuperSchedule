using SuperSchedule.Database.Models;
using SuperSchedule.Database.Repositories.ShiftTypes;

namespace SuperSchedule.Services.ShiftTypes
{
    public class ShiftTypeService : IShiftTypeService
    {
        private readonly IShiftTypeRepository shiftTypeRepository;

        public ShiftTypeService(IShiftTypeRepository shiftTypeRepository)
        {
            this.shiftTypeRepository = shiftTypeRepository;
        }

        public async Task CrateShiftType(ShiftType shiftType)
        {
            await shiftTypeRepository.CrateShiftType(shiftType);
        }

        public IEnumerable<ShiftType> GetAllShiftTypes()
        {
            return shiftTypeRepository.GetAllShiftTypes().ToList();
        }

        public ShiftType GetShiftTypeById(int id)
        {
            return shiftTypeRepository.GetShiftTypeById(id);
        }

        public ShiftType GetDefaultBreakShiftType()
        {
            return shiftTypeRepository.GetDefaultBreakShiftType();
        }
    }
}
