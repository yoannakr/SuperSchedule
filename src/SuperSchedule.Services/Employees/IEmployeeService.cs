﻿using SuperSchedule.Database.Models;

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
    }
}
