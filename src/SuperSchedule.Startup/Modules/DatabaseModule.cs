using Autofac;
using SuperSchedule.Database.Data;
using SuperSchedule.Database.Repositories.Days;
using SuperSchedule.Database.Repositories.Locations;
using SuperSchedule.Database.Repositories.ShiftTypes;

namespace SuperSchedule.Startup.Modules
{
    public class DatabaseModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<SuperScheduleDbContext>().AsSelf().InstancePerLifetimeScope();
            builder.RegisterType<LocationRepository>().As<ILocationRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ShiftTypeRepository>().As<IShiftTypeRepository>().InstancePerLifetimeScope();
            builder.RegisterType<DayRepository>().As<IDayRepository>().InstancePerLifetimeScope();
        }
    }
}
