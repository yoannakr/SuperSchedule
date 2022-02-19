using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace SuperSchedule.Startup.Controllers
{
    [EnableCors("MyPolicy")]
    [ApiController]
    [Route("[controller]/[action]")]
    public class ApiController : ControllerBase
    {
    }
}
