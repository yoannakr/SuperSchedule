using Microsoft.EntityFrameworkCore;
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

        public DbSet<Role> Roles { get; set; }

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
                .WithOne(sh => sh.Location)
                .IsRequired();

            builder.Entity<ShiftType>(builder =>
            {
                builder.Property(x => x.StartTime)
                    .HasConversion<TimeOnlyConverter, TimeOnlyComparer>();

                builder.Property(x => x.EndTime)
                    .HasConversion<TimeOnlyConverter, TimeOnlyComparer>();
            });
        }
    }
}
