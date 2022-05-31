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

        public async Task DeleteEmployee(int employeeId)
        {
            var contextEmployee = superScheduleDbContext.Employees.FirstOrDefault(e => e.Id == employeeId);
            if(contextEmployee == null)
            {
                return;
            }

            contextEmployee.IsDeleted = true;
            superScheduleDbContext.Employees.Update(contextEmployee);

            await superScheduleDbContext.SaveChangesAsync();
        }

        public IEnumerable<Employee> GetAllCurrentEmployees()
        {
            return superScheduleDbContext
                .Employees
                .Include(e => e.Position)
                .Include(e => e.Locations)
                .Include(e => e.ShiftTypes)
                .Where(e => !e.IsDeleted)
                .ToList();
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

        public IEnumerable<Employee> GetEmployeesWithLowestPositionPriority()
        {
            return superScheduleDbContext
                .Employees
                .Include(e => e.Locations)
                .Include(e => e.Position)
                .ToList()
                .GroupBy(e => e.Position.Priority)
                .LastOrDefault()
                .Select(e => e);
        }

        public async Task UpdateEmployee(Employee employee)
        {
            var contextEmployee = superScheduleDbContext.Employees.
                Include(e => e.Locations).Include(e => e.ShiftTypes).FirstOrDefault(e => e.Id == employee.Id);
            if(contextEmployee == null)
            {
                return;
            }

            contextEmployee.FirstName = employee.FirstName;
            contextEmployee.MiddleName = employee.MiddleName;   
            contextEmployee.LastName = employee.LastName;
            contextEmployee.VacationDays = employee.VacationDays;
            contextEmployee.Position = employee.Position;
            contextEmployee.Locations = employee.Locations;
            contextEmployee.ShiftTypes = employee.ShiftTypes;

            superScheduleDbContext.Employees.Update(contextEmployee);
            await superScheduleDbContext.SaveChangesAsync();
        }

        public async Task UpdateEmployeeVacationDays(Employee employee, int totalNewLeaveDays)
        {
            var contextEmployee = superScheduleDbContext.Employees.FirstOrDefault(e => e.Id == employee.Id);
            if (contextEmployee == null)
            {
                return;
            }

            contextEmployee.VacationDays = totalNewLeaveDays;
            superScheduleDbContext.Employees.Update(contextEmployee);
            await superScheduleDbContext.SaveChangesAsync();
        }
    }
}
