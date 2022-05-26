using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Users
{
    public interface IUserRepository
    {
        Task CreateUser(User user);

        (bool isUserExist, bool isAdmin) Login(string username, string password);
    }
}
