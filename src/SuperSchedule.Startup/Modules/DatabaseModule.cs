using Autofac;
using SuperSchedule.Database.Data;
using SuperSchedule.Database.Repositories.Locations;

namespace SuperSchedule.Startup.Modules
{
    public class DatabaseModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<SuperScheduleDbContext>().AsSelf().InstancePerLifetimeScope();
            builder.RegisterType<LocationRepository>().As<ILocationRepository>().InstancePerLifetimeScope();
        }
    }
}
