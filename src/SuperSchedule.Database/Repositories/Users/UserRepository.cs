using SuperSchedule.Database.Data;
using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Users
{
    public class UserRepository : IUserRepository
    {
        private readonly SuperScheduleDbContext superScheduleDbContext;

        public UserRepository(SuperScheduleDbContext superScheduleDbContext)
        {
            this.superScheduleDbContext = superScheduleDbContext;
        }

        public async Task CreateUser(User user)
        {
            superScheduleDbContext.Users.Add(user);

            await superScheduleDbContext.SaveChangesAsync();
        }

        public (bool isUserExist, bool isAdmin) Login(string username, string password)
        {
            var user = superScheduleDbContext.Users.FirstOrDefault(u => u.Username == username && u.Password == password);

            return (user != null, user?.Role == Enums.Role.Administrator);
        }
    }
}
