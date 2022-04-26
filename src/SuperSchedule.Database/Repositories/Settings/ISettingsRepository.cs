using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Settings
{
    public interface ISettingsRepository
    {
        Setting GetSettings();

        Task UpdateSettings(Setting setting);

        Task FillPublicHolidaysForYear(int year);

        int? GetLastPublicHolidayYear();
    }
}
