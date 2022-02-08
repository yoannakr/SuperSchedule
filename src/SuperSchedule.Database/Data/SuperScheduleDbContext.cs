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
        }

        public SuperScheduleDbContext(DbContextOptions<SuperScheduleDbContext> options)
            : base(options)
        {
        }

        public DbSet<ShiftType> ShiftTypes { get; set; }

        public DbSet<Day> Days { get; set; }

        public DbSet<Location> Locations { get; set; }

        public DbSet<Role> Roles { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            if (!builder.IsConfigured)
            {
                builder.UseSqlServer(DataSettings.Connection);
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
