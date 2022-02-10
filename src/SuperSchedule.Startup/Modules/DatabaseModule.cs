using Autofac;
using SuperSchedule.Database.Data;

namespace SuperSchedule.Startup.Modules
{
    public class DatabaseModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<SuperScheduleDbContext>().AsSelf().InstancePerLifetimeScope();
        }
    }
}
