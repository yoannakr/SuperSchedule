using Microsoft.EntityFrameworkCore;
using Nager.Date;
using SuperSchedule.Database.Comparers;
using SuperSchedule.Database.Converters;
using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Data
{
    public class SuperScheduleDbContext : DbContext
    {
        public SuperScheduleDbContext()
        {
            var folder = Environment.SpecialFolder.LocalApplicationData;
            var path = Environment.GetFolderPath(folder);
            DbPath = Path.Join(path, "superSchedule.db");
        }

        public string DbPath { get; }

        public DbSet<ShiftType> ShiftTypes { get; set; }

        public DbSet<Day> Days { get; set; }

        public DbSet<Location> Locations { get; set; }

        public DbSet<Position> Positions { get; set; }

        public DbSet<Employee> Employees { get; set; }

        public DbSet<Role> Roles { get; set; }

        public DbSet<Schedule> Schedules { get; set; }

        public DbSet<Setting> Settings { get; set; }

        public DbSet<Holiday> Holidays { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            if (!builder.IsConfigured)
            {
                builder.UseSqlite($"Data Source={DbPath}");
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Location>()
                .HasMany(l => l.ShiftTypes)
                .WithOne(sh => sh.Location);

            builder.Entity<ShiftType>(builder =>
            {
                builder.Property(x => x.StartTime)
                    .HasConversion<TimeOnlyConverter, TimeOnlyComparer>();

                builder.Property(x => x.EndTime)
                    .HasConversion<TimeOnlyConverter, TimeOnlyComparer>();
            });
        }

        public void FillDatabase()
        {
            Days.AddRange(
                new Day { Name = "Понеделник" },
                new Day { Name = "Вторник" },
                new Day { Name = "Сряда" },
                new Day { Name = "Четвъртък" },
                new Day { Name = "Петък" },
                new Day { Name = "Събота" },
                new Day { Name = "Неделя" }
                );

            ShiftTypes.Add(new ShiftType
            {
                Name = "почивка",
                Abbreviation = "П",
                StartTime = new TimeOnly(0, 0),
                EndTime = new TimeOnly(0, 0),
                RotationDays = 0,
                Priority = 0
            });

            var publicHolidaysDates = DateSystem.GetPublicHolidays(DateTime.UtcNow.Year, CountryCode.BG)
                .Select(h => new Holiday { Date = h.Date, Name = h.LocalName });

            Settings.Add(new Setting
            {
                NightWorkRate = 1.143,
                MaxHoursPerWeek = 56,
                MaxOvertimeHoursPerMonth = 30,
                MaxOvertimeHoursPerYear = 150,
                Holidays = new List<Holiday>(publicHolidaysDates)
            });

            SaveChanges();
        }
    }
}
