using SuperSchedule.Database.Models;

namespace SuperSchedule.Database.Repositories.Employees
{
    public interface IEmployeeRepository
    {
        Task CreateEmployee(Employee employee);

        IEnumerable<Employee> GetAllEmployees();

        Employee GetEmployeeById(int id);

        IEnumerable<Employee> GetEmployeeByLocation(int locationId);

        IEnumerable<Employee> GetEmployeesWithLowestPositionPriority();
    }
}
