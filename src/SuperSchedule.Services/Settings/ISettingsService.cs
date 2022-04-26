using SuperSchedule.Database.Models;

namespace SuperSchedule.Services.Settings
{
    public interface ISettingsService
    {
        Setting GetSettings();

        Task UpdateSettings(Setting setting);
    }
}
