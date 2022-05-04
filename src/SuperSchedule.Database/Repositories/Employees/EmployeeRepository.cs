using Microsoft.EntityFrameworkCore;
using SuperSchedule.Database.Data;
using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Employees
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly SuperScheduleDbContext superScheduleDbContext;

        public EmployeeRepository(SuperScheduleDbContext superScheduleDbContext)
        {
            this.superScheduleDbContext = superScheduleDbContext;
        }

        public async Task CreateEmployee(Employee employee)
        {
            superScheduleDbContext.Employees.Add(employee);

            await superScheduleDbContext.SaveChangesAsync();
        }

        public IEnumerable<Employee> GetAllEmployees()
        {
            return superScheduleDbContext
                .Employees
                .Include(e => e.Position)
                .Include(e => e.Locations)
                .Include(e => e.ShiftTypes)
                .ToList();
        }

        public Employee GetEmployeeById(int id)
        {
           return superScheduleDbContext
                .Employees
                .Include(e => e.Position)
                .Include(e => e.Locations)
                .Include(e => e.ShiftTypes)
                .Where(e => e.Id == id)
                .FirstOrDefault();
        }

        public IEnumerable<Employee> GetEmployeeByLocation(int locationId)
        {
            return superScheduleDbContext
                .Employees
                .Include(e => e.Locations)
                .Include(e => e.Position)
                .Where(e => e.Locations.Select(l => l.Id).Contains(locationId));
        }
    }
}
