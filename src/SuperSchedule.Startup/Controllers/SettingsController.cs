using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Database.Models;
using SuperSchedule.Services.Settings;
using SuperSchedule.Startup.Models;

namespace SuperSchedule.Startup.Controllers
{
    public class SettingsController : ApiController
    {
        private readonly ISettingsService settingsService;

        public SettingsController(ISettingsService settingsService)
        {
            this.settingsService = settingsService;
        }

        [HttpGet]
        public SettingModel GetSettings()
        {
            var settings = settingsService.GetSettings();
            return new SettingModel
            {
                Id = settings.Id,
                NightWorkRate = settings.NightWorkRate,
                MaxHoursPerWeek = settings.MaxHoursPerWeek,
                MaxOvertimeHoursPerMonth = settings.MaxOvertimeHoursPerMonth,
                MaxOvertimeHoursPerYear = settings.MaxOvertimeHoursPerYear,
                SecretaryName = settings.SecretaryName,
                ManagerName = settings.ManagerName,
                Holidays = settings.Holidays.Select(h => new HolidayModel
                {
                    Id = h.Id,
                    Name = h.Name,
                    Date = h.Date
                }),
            };
        }

        [HttpGet]
        public string GetSecretaryName()
        {
            var settings = settingsService.GetSettings();

            return settings.SecretaryName;
        }

        [HttpGet]
        public string GetManagerName()
        {
            var settings = settingsService.GetSettings();

            return settings.ManagerName;
        }

        [HttpPost]
        public async Task UpdateSettings(SettingModel setting)
        {
            await settingsService.UpdateSettings(new Setting
            {
                Id = setting.Id,
                NightWorkRate = setting.NightWorkRate,
                MaxHoursPerWeek = setting.MaxHoursPerWeek,
                MaxOvertimeHoursPerMonth = setting.MaxOvertimeHoursPerMonth,
                MaxOvertimeHoursPerYear = setting.MaxOvertimeHoursPerYear,
                SecretaryName = setting.SecretaryName,
                ManagerName = setting.ManagerName,
                Holidays = setting.Holidays.Select(h => new Holiday
                {
                    Id = h.Id,
                    Name = h.Name,
                    Date = h.Date
                }).ToList(),
            });
        }
    }
}
