using Autofac;
using SuperSchedule.Services.Locations;

namespace SuperSchedule.Startup.Modules
{
    public class ServicesModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<LocationService>().As<ILocationService>().InstancePerLifetimeScope();
        }
    }
}
