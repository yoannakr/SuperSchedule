using Microsoft.EntityFrameworkCore;
using Nager.Date;
using SuperSchedule.Database.Data;
using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Settings
{
    public class SettingsRepository : ISettingsRepository
    {
        private readonly SuperScheduleDbContext superScheduleDbContext;

        public SettingsRepository(SuperScheduleDbContext superScheduleDbContext)
        {
            this.superScheduleDbContext = superScheduleDbContext;
        }

        public Setting GetSettings()
        {
            return superScheduleDbContext.Settings.Include(s => s.Holidays).FirstOrDefault();
        }

        public async Task UpdateSettings(Setting setting)
        {
            var holidayIds = setting.Holidays.Select(h => h.Id).ToList();
            var contextHolidays = superScheduleDbContext.Holidays.Where(h => !holidayIds.Contains(h.Id)).ToList();
            superScheduleDbContext.Holidays.RemoveRange(contextHolidays);
            superScheduleDbContext.Update(setting);

            await superScheduleDbContext.SaveChangesAsync();
        }

        public async Task FillPublicHolidaysForYear(int year)
        {
            var settings = GetSettings();
            var publicHolidaysDates = DateSystem.GetPublicHolidays(year, CountryCode.BG).Select(h => h.Date);
            var previousPubllicHolidaysDates = settings.Holidays.Select(h => h.Date).ToList();
            if (previousPubllicHolidaysDates != null)
            {
                publicHolidaysDates = publicHolidaysDates.Where(date => !previousPubllicHolidaysDates.Contains(date)).ToList();
            }

            var holidays = publicHolidaysDates.Select(h => new Holiday { Date = h.Date });
            var newHolidays = settings.Holidays.ToList();
            newHolidays.AddRange(holidays);
            settings.Holidays = newHolidays;

            await UpdateSettings(settings);
        }

        public int? GetLastPublicHolidayYear()
        {
            return GetSettings().Holidays.OrderBy(h => h.Date).LastOrDefault()?.Date.Year;
        }

    }
}
