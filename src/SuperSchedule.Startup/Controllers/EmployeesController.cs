﻿using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Database.Models;
using SuperSchedule.Services.Employees;
using SuperSchedule.Services.Locations;
using SuperSchedule.Services.Positions;
using SuperSchedule.Services.ShiftTypes;
using SuperSchedule.Startup.Models;

namespace SuperSchedule.Startup.Controllers
{
    public class EmployeesController : ApiController
    {
        private readonly IEmployeeService employeeService;
        private readonly IPositionService positionService;
        private readonly ILocationService locationService;
        private readonly IShiftTypeService shiftTypeService;

        public EmployeesController(IEmployeeService employeeService, IPositionService positionService, ILocationService locationService, IShiftTypeService shiftTypeService)
        {
            this.employeeService = employeeService;
            this.positionService = positionService;
            this.locationService = locationService;
            this.shiftTypeService = shiftTypeService;
        }

        [HttpPost]
        public async Task CreateEmployee([FromBody] EmployeeModel employeeModel)
        {
            await employeeService.CreateEmployee(new Employee
            {
                FirstName = employeeModel.FirstName,
                MiddleName = employeeModel.MiddleName,
                LastName = employeeModel.LastName,
                VacationDays = employeeModel.VacationDays,
                Position = positionService.GetPositionById(employeeModel.PositionId),
                Locations = employeeModel.LocationsIds.Select(id => locationService.GetLocationById(id)).ToList(),
                ShiftTypes = employeeModel.ShiftTypesIds.Select(id => shiftTypeService.GetShiftTypeById(id)).ToList(),
                PreviousEmployee = employeeService.GetEmployeeById(employeeModel.PreviousEmployeeId)
            });
        }

        [HttpGet]
        public IEnumerable<EmployeeModel> GetAllEmployees()
        {
            return employeeService.GetAllEmployees().Select(employee =>
                new EmployeeModel
                {
                    Id = employee.Id,
                    FirstName = employee.FirstName,
                    MiddleName = employee.MiddleName,
                    LastName = employee.LastName,
                    FullName = employee.FullName,
                    VacationDays = employee.VacationDays,
                    PositionId = employee.Position.Id,
                    PositionName = employee.Position.Name,
                    LocationsIds = employee.Locations.Select(l => l.Id),
                    ShiftTypesIds = employee.ShiftTypes.Select(sh => sh.Id),
                    PreviousEmployeeId = employee.PreviousEmployee?.Id ?? 0
                });
        }

        [HttpGet]
        public IEnumerable<EmployeeModel> GetAllReservesEmployees()
        {
            return employeeService.GetAllEmployees().Where(e => e.Position.Priority != 1).Select(employee =>
                new EmployeeModel
                {
                    Id = employee.Id,
                    FirstName = employee.FirstName,
                    MiddleName = employee.MiddleName,
                    LastName = employee.LastName,
                    FullName = employee.FullName,
                    VacationDays = employee.VacationDays,
                    PositionId = employee.Position.Id,
                    PositionName = employee.Position.Name,
                    LocationsIds = employee.Locations.Select(l => l.Id),
                    ShiftTypesIds = employee.ShiftTypes.Select(sh => sh.Id),
                    PreviousEmployeeId = employee.PreviousEmployee?.Id ?? 0
                });
        }

        [HttpGet]
        public IEnumerable<EmployeeModel> GetAllCurrentEmployees()
        {
            return employeeService.GetAllCurrentEmployees().Select(employee =>
                new EmployeeModel
                {
                    Id = employee.Id,
                    FirstName = employee.FirstName,
                    MiddleName = employee.MiddleName,
                    LastName = employee.LastName,
                    FullName = employee.FullName,
                    VacationDays = employee.VacationDays,
                    PositionId = employee.Position.Id,
                    IsDeleted = employee.IsDeleted,
                    PositionName = employee.Position.Name,
                    LocationsIds = employee.Locations.Select(l => l.Id),
                    ShiftTypesIds = employee.ShiftTypes.Select(sh => sh.Id),
                    PreviousEmployeeId = employee.PreviousEmployee?.Id ?? 0
                });
        }


        [HttpDelete]
        public async Task DeleteEmployee(int employeeId)
        {
            await employeeService.DeleteEmployee(employeeId);
        }

        [HttpPost]
        public async Task UpdateEmployee(EmployeeModel employee)
        {
            await employeeService.UpdateEmployee(new Employee
            {
                Id=employee.Id,
                FirstName=employee.FirstName,
                MiddleName=employee.MiddleName,
                LastName=employee.LastName,
                VacationDays=employee.VacationDays,
                Position = positionService.GetPositionById(employee.PositionId),
                Locations = employee.LocationsIds.Select(id => locationService.GetLocationById(id)).ToList(),
                ShiftTypes = employee.ShiftTypesIds.Select(id => shiftTypeService.GetShiftTypeById(id)).ToList(),
                PreviousEmployee = employeeService.GetEmployeeById(employee.PreviousEmployeeId)
            });
        }

    }
}
