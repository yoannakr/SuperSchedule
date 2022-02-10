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

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Database.Models.Location> Get()
        {
            using (var context = new SuperScheduleDbContext())
            {
                context.Database.EnsureCreated();

                context.Locations.Add(new Database.Models.Location { Name = "Test", Abbreviation = "Test" });
                context.SaveChanges();
                return context.Locations.ToList();
            }
        }
    }
}