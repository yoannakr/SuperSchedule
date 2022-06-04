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

        public async Task DeleteUser(int userId)
        {
            await userRepository.DeleteUser(userId);
        }

        public IEnumerable<User> GetAllUsers()
        {
            return userRepository.GetAllUsers();
        }

        public (bool isUserExist, bool isAdmin) Login(string username, string password)
        {
            return userRepository.Login(username, password);
        }

        public async Task UpdateUser(User user)
        {
            await userRepository.UpdateUser(user);
        }
    }
}
