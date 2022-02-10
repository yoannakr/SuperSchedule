using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Database.Data;

namespace SuperSchedule.Startup.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly SuperScheduleDbContext _superScheduleDbContext;

        public WeatherForecastController(SuperScheduleDbContext superScheduleDbContext, ILogger<WeatherForecastController> logger)
        {
            _superScheduleDbContext = superScheduleDbContext;
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Database.Models.Location> Get()
        {
            _superScheduleDbContext.Database.EnsureCreated();

            _superScheduleDbContext.Locations.Add(new Database.Models.Location { Name = "Test", Abbreviation = "Test" });
            _superScheduleDbContext.SaveChanges();
            return _superScheduleDbContext.Locations.ToList();
        }
    }
}