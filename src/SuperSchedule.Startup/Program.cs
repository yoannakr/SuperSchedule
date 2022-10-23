using Autofac;
using Autofac.Extensions.DependencyInjection;
using SuperSchedule.Database.Data;
using Serilog;
using SuperSchedule.Database.Repositories.Settings;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

Log.Information("Starting up");

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((ctx, lc) => lc
        .WriteTo.Console()
        .WriteTo.File("./logs/log-.txt", rollingInterval: RollingInterval.Day)
        .ReadFrom.Configuration(ctx.Configuration));

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
    var isDatabaseCreated = superScheduleDbContext?.Database.EnsureCreated() ?? false;
    if (isDatabaseCreated)
    {
        app.Logger.LogInformation("Database created");
        superScheduleDbContext?.FillDatabase();
        app.Logger.LogInformation("Database filled");
    }

    var settingsRepository = app.Services.GetService(typeof(ISettingsRepository)) as SettingsRepository;
    var isNewYear = settingsRepository?.GetLastPublicHolidayYear() < DateTime.UtcNow.Year;

    if (isNewYear)
    {
        settingsRepository?.FillPublicHolidaysForYear(DateTime.UtcNow.Year);
    }

    // Configure the HTTP request pipeline.

    app.UseSerilogRequestLogging();

    app.UseCors(MyPolicy);

    app.UseAuthorization();

    app.MapControllers();

    app.Run("http://localhost:5013");
}
catch (Exception ex)
{
    Log.Fatal(ex, "Exception in program.cs");
}
finally
{
    Log.Information("Shut down complete");
    Log.CloseAndFlush();
}
