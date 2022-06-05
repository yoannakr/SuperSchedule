using SuperSchedule.Database.Models;
using SuperSchedule.Database.Repositories.Employees;

namespace SuperSchedule.Services.Employees
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            this.employeeRepository = employeeRepository;
        }

        public async Task CreateEmployee(Employee employee)
        {
            await employeeRepository.CreateEmployee(employee);
        }

        public async Task DeleteEmployee(int employeeId)
        {
            await employeeRepository.DeleteEmployee(employeeId);
        }

        public IEnumerable<Employee> GetAllCurrentEmployees()
        {
            return employeeRepository.GetAllCurrentEmployees();
        }

        public IEnumerable<Employee> GetAllEmployees()
        {
            return employeeRepository.GetAllEmployees();
        }

        public Employee GetEmployeeById(int id)
        {
            return employeeRepository.GetEmployeeById(id);
        }

        public IEnumerable<Employee> GetCurrentEmployeeByLocation(int locationId)
        {
            return employeeRepository.GetCurrentEmployeeByLocation(locationId);
        }

        public IEnumerable<Employee> GetEmployeeByLocation(int locationId)
        {
            return employeeRepository.GetEmployeeByLocation(locationId);
        }

        public IEnumerable<Employee> GetEmployeesWithLowestPositionPriority()
        {
            return employeeRepository.GetEmployeesWithLowestPositionPriority();
        }

        public async Task UpdateEmployee(Employee employee)
        {
            await employeeRepository.UpdateEmployee(employee);
        }

        public async Task UpdateEmployeeVacationDays(Employee contextEmployee, int totalNewLeaveDays)
        {
            await employeeRepository.UpdateEmployeeVacationDays(contextEmployee, totalNewLeaveDays);
        }
    }
}
