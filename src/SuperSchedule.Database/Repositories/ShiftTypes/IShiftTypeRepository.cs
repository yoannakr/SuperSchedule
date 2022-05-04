﻿using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.ShiftTypes
{
    public interface IShiftTypeRepository
    {
        Task CrateShiftType(ShiftType shiftType);

        IEnumerable<ShiftType> GetAllShiftTypes();

        ShiftType GetShiftTypeById(int id);

        ShiftType GetDefaultBreakShiftType();

        IEnumerable<ShiftType> GetShiftTypesByLocation(int locationId);
    }
}
