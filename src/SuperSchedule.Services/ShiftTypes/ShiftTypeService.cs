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

        public IEnumerable<ShiftType> GetShiftTypesByLocation(int locationId)
        {
            return shiftTypeRepository.GetShiftTypesByLocation(locationId);
        }

        public IEnumerable<ShiftType> GetShiftTypesByLocationIncludingDefaultBreak(int locationId)
        {
            return shiftTypeRepository.GetShiftTypesByLocationIncludingDefaultBreak(locationId);
        }

        public ShiftType GetDefaultLeaveWorkDaysShiftType()
        {
            return shiftTypeRepository.GetDefaultLeaveWorkDaysShiftType();
        }

        public ShiftType GetDefaultLeaveWeekendDaysShiftType()
        {
            return shiftTypeRepository.GetDefaultLeaveWeekendDaysShiftType();
        }

        public bool IsShiftTypeBreak(ShiftType shiftType)
        {
            return shiftType.Location == null && shiftType.Priority == 3;
        }

        public bool IsShiftTypeLeave(ShiftType shiftType)
        {
            return shiftType.Location == null && (shiftType.Priority == 1 || shiftType.Priority == 2 || shiftType.Priority == 4 || shiftType.Priority == 5);
        }

        public ShiftType GetDefaultSickLeaveWorkDaysShiftType()
        {
            return shiftTypeRepository.GetDefaultSickLeaveWorkDaysShiftType();
        }

        public ShiftType GetDefaultSickLeaveWeekendDaysShiftType()
        {
            return shiftTypeRepository.GetDefaultSickLeaveWeekendDaysShiftType();
        }

        public IEnumerable<ShiftType> GetAllShiftTypesForEmployee(int employeeId)
        {
            return shiftTypeRepository.GetAllShiftTypesForEmployee(employeeId);
        }

        public IEnumerable<ShiftType> GetAllCurrentShiftTypes()
        {
            return shiftTypeRepository.GetAllCurrentShiftTypes().ToList();
        }

        public async Task DeleteShiftType(int shiftTypeId)
        {
            await shiftTypeRepository.DeleteShiftType(shiftTypeId);
        }

        public async Task UpdateShiftType(ShiftType shiftType)
        {
            await shiftTypeRepository.UpdateShiftType(shiftType);
        }
    }
}
