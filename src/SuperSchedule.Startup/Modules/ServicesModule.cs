﻿using Autofac;
using SuperSchedule.Services.Days;
using SuperSchedule.Services.Employees;
using SuperSchedule.Services.Locations;
using SuperSchedule.Services.Positions;
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
            builder.RegisterType<PositionService>().As<IPositionService>().InstancePerLifetimeScope();
            builder.RegisterType<EmployeeService>().As<IEmployeeService>().InstancePerLifetimeScope();
        }
    }
}
