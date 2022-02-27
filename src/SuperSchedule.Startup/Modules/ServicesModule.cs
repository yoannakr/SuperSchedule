using Autofac;
using SuperSchedule.Services.Days;
using SuperSchedule.Services.Locations;
using SuperSchedule.Services.ShiftTypes;

namespace SuperSchedule.Startup.Modules
{
    public class ServicesModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<LocationService>().As<ILocationService>().InstancePerLifetimeScope();
            builder.RegisterType<ShiftTypeService>().As<IShiftTypeService>().InstancePerLifetimeScope();
            builder.RegisterType<DayService>().As<IDayService>().InstancePerLifetimeScope();
        }
    }
}
