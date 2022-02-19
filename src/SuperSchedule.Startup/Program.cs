using Autofac;
using Autofac.Extensions.DependencyInjection;
using SuperSchedule.Database.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());

// Register services directly with Autofac here. Don't
// call builder.Populate(), that happens in AutofacServiceProviderFactory.

builder.Host.ConfigureContainer<ContainerBuilder>(builder => builder.RegisterAssemblyModules(typeof(Program).Assembly));

// Add services to the container.

var MyPolicy = "MyPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyPolicy,
                      builder =>
                      {
                          builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                          .AllowAnyHeader();
                      });
});

builder.Services.AddControllers();

var app = builder.Build();

var superScheduleDbContext = app.Services.GetService(typeof(SuperScheduleDbContext)) as SuperScheduleDbContext;
superScheduleDbContext?.Database.EnsureCreated();

// Configure the HTTP request pipeline.

app.UseCors(MyPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
