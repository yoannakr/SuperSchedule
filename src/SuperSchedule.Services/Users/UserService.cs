using SuperSchedule.Database.Models;
using SuperSchedule.Database.Repositories.Users;

namespace SuperSchedule.Services.Users
{
    public class UserService : IUserService
    {
        private readonly IUserRepository userRepository;

        public UserService(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        public async Task CreateUser(User user)
        {
            await userRepository.CreateUser(user);
        }

        public (bool isUserExist, bool isAdmin) Login(string username, string password)
        {
            return userRepository.Login(username, password);
        }
    }
}
