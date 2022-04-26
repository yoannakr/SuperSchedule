using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Services.Schedules;

namespace SuperSchedule.Startup.Controllers
{
    public class ScheduleController : ApiController
    {
        private readonly IScheduleService scheduleService;

        public ScheduleController(IScheduleService scheduleService)
        {
            this.scheduleService = scheduleService;
        }

        [HttpPost]
        public async Task FillSchedulesForMonth(DateTime startDate, DateTime endDate)
        {
            await scheduleService.FillSchedulesForMonth(startDate, endDate);
        }
    }
}
