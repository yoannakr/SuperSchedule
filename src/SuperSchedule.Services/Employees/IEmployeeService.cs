using SuperSchedule.Database.Models;

namespace SuperSchedule.Services.Employees
{
    public interface IEmployeeService
    {
        Task CreateEmployee(Employee employee);

        IEnumerable<Employee> GetAllEmployees();

        Employee GetEmployeeById(int id);

        IEnumerable<Employee> GetEmployeeByLocation(int locationId);

        IEnumerable<Employee> GetEmployeesWithLowestPositionPriority();

        IEnumerable<Employee> GetAllCurrentEmployees();

        Task DeleteEmployee(int employeeId);

        Task UpdateEmployee(Employee employee);

        Task UpdateEmployeeVacationDays(Employee contextEmployee, int totalNewLeaveDays);

        IEnumerable<Employee> GetCurrentEmployeeByLocation(int locationId);
    }
}
