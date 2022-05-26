using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Database.Enums;
using SuperSchedule.Database.Models;
using SuperSchedule.Services.Users;
using SuperSchedule.Startup.Models;

namespace SuperSchedule.Startup.Controllers
{
    public class UsersController : ApiController
    {
        private readonly IUserService userService;

        public UsersController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpPost]
        public async Task CreateUser(UserModel user)
        {
            await userService.CreateUser(new User
            {
                Username = user.Username,
                Password = user.Password,
                Role = (Role)user.Role
            });
        }

        [HttpGet]
        public ActionResult<bool> Login(string? username, string? password)
        {
            var (isUserExist, isAdmin) = userService.Login(username, password);

            if (!isUserExist)
            {
                return BadRequest();
            }

            return Ok(isAdmin);
        }
    }
}
