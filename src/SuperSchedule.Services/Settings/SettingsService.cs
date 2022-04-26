using SuperSchedule.Database.Models;
using SuperSchedule.Database.Repositories.Settings;

namespace SuperSchedule.Services.Settings
{
    public class SettingsService : ISettingsService
    {
        private readonly ISettingsRepository settingsRepository;

        public SettingsService(ISettingsRepository settingsRepository)
        {
            this.settingsRepository = settingsRepository;
        }

        public Setting GetSettings()
        {
            return settingsRepository.GetSettings();
        }

        public async Task UpdateSettings(Setting setting)
        {
            await settingsRepository.UpdateSettings(setting);
        }
    }
}
