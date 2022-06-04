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


        [HttpGet]
        public IEnumerable<UserModel> GetAllUsers()
        {
            return userService.GetAllUsers().Select(user =>
                new UserModel
                {
                    Id = user.Id,
                    Username = user.Username,
                    Password = user.Password,
                    Role = (int)user.Role,
                    RoleName = user.Role.GetDisplayName()
                });
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

        [HttpDelete]
        public async Task DeleteUser(int userId)
        {
            await userService.DeleteUser(userId);
        }

        [HttpPost]
        public async Task UpdateUser(UserModel userInputModel)
        {
            await userService.UpdateUser(new User
            {
                Id = userInputModel.Id,
                Username = userInputModel.Username,
                Password = userInputModel.Password,
                Role = (Role)userInputModel.Role
            });
        }
    }
}
