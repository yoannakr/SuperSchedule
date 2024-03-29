﻿using SuperSchedule.Database.Models;

namespace SuperSchedule.Services.Users
{
    public interface IUserService
    {
        Task CreateUser(User user);

        (bool isUserExist, bool isAdmin) Login(string username, string password);
        
        IEnumerable<User> GetAllUsers();

        Task DeleteUser(int userId);

        Task UpdateUser(User user);
    }
}
