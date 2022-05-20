using Autofac;
using SuperSchedule.Database.Data;
using SuperSchedule.Database.Repositories.Days;
using SuperSchedule.Database.Repositories.Employees;
using SuperSchedule.Database.Repositories.Locations;
using SuperSchedule.Database.Repositories.Positions;
using SuperSchedule.Database.Repositories.Schedules;
using SuperSchedule.Database.Repositories.Settings;
using SuperSchedule.Database.Repositories.ShiftTypes;
using SuperSchedule.Database.Repositories.Leaves;

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
            builder.RegisterType<PositionRepository>().As<IPositionRepository>().InstancePerLifetimeScope();
            builder.RegisterType<EmployeeRepository>().As<IEmployeeRepository>().InstancePerLifetimeScope();
            builder.RegisterType<SettingsRepository>().As<ISettingsRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ScheduleRepository>().As<IScheduleRepository>().InstancePerLifetimeScope();
            builder.RegisterType<LeaveRepository>().As<ILeaveRepository>().InstancePerLifetimeScope();
        }
    }
}
