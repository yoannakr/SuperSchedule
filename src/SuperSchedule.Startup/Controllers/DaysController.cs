using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Database.Models;
using SuperSchedule.Services.Days;

namespace SuperSchedule.Startup.Controllers
{
    public class DaysController : ApiController
    {
        private readonly IDayService dayService;

        public DaysController(IDayService dayService)
        {
            this.dayService = dayService;
        }

        [HttpGet]
        public IEnumerable<Day> GetAllDays()
        {
            return dayService.GetAllDays();
        } 
    }
}
