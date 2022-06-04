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

        public async Task DeleteUser(int userId)
        {
            var contextUser = superScheduleDbContext.Users.FirstOrDefault(e => e.Id == userId);
            if (contextUser == null)
            {
                return;
            }

            superScheduleDbContext.Users.Remove(contextUser);

            await superScheduleDbContext.SaveChangesAsync();
        }

        public IEnumerable<User> GetAllUsers()
        {
            return superScheduleDbContext.Users.ToList();
        }

        public (bool isUserExist, bool isAdmin) Login(string username, string password)
        {
            var user = superScheduleDbContext.Users.FirstOrDefault(u => u.Username == username && u.Password == password);

            return (user != null, user?.Role == Enums.Role.Administrator);
        }

        public async Task UpdateUser(User user)
        {
            var contextUser = superScheduleDbContext.Users.FirstOrDefault(e => e.Id == user.Id);
            if (contextUser == null)
            {
                return;
            }

            contextUser.Username = user.Username;
            contextUser.Password = user.Password;
            contextUser.Role = user.Role;

            superScheduleDbContext.Users.Update(contextUser);
            await superScheduleDbContext.SaveChangesAsync();
        }
    }
}
