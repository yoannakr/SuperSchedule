﻿using SuperSchedule.Database.Models;
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

        public IEnumerable<Employee> GetAllEmployees()
        {
            return employeeRepository.GetAllEmployees();
        }
    }
}
