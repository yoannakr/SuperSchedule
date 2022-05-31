using Microsoft.AspNetCore.Mvc;
using SuperSchedule.Database.Enums;
using SuperSchedule.Database.Models;
using SuperSchedule.Services.Employees;
using SuperSchedule.Services.Leaves;
using SuperSchedule.Startup.Models;

namespace SuperSchedule.Startup.Controllers
{
    public class LeavesController : ApiController
    {
        private readonly ILeaveService leaveService;
        private readonly IEmployeeService employeeService;

        public LeavesController(ILeaveService leaveService, IEmployeeService employeeService)
        {
            this.leaveService = leaveService;
            this.employeeService = employeeService;
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<string>>> CreateLeave([FromBody] LeaveModel leaveModel)
        {
            if(leaveModel == null)
            {
                return new OkResult();
            }

            var (hasErrors,errorMessages) = await leaveService.CreateLeave(new Leave
            {
                FromDate = leaveModel.FromDate,
                ToDate = leaveModel.ToDate,
                LeaveType = (LeaveType)leaveModel.LeaveTypeId,
                Comment = leaveModel.Comment,
                Employee = employeeService.GetEmployeeById(leaveModel.EmployeeId)
            });

            if (hasErrors)
            {
                return new BadRequestObjectResult(errorMessages);
            }

            return new OkResult();
        }

        [HttpPost]
        public async Task UpdateLeave([FromBody] LeaveModel leaveModel)
        {
            await leaveService.UpdateLeave(new Leave
            {
                Id = leaveModel.Id,
                FromDate = leaveModel.FromDate,
                ToDate = leaveModel.ToDate,
                LeaveType = (LeaveType)leaveModel.LeaveTypeId,
                Comment = leaveModel.Comment,
                Employee = employeeService.GetEmployeeById(leaveModel.EmployeeId)
            });
        }

        [HttpGet]
        public IEnumerable<LeaveModel> GetLeavesForEmployee(int employeeId, DateTime startDate, DateTime endDate)
        {
            return leaveService.GetAllLeavesForEmployee(employeeId, startDate, endDate).Select(leave =>
               new LeaveModel
               {
                   Id = leave.Id,
                   FromDate = leave.FromDate,
                   ToDate = leave.ToDate,
                   LeaveTypeId = (int)leave.LeaveType,
                   LeaveTypeName = leave.LeaveType.GetDisplayName(),
                   Comment = leave.Comment
               }).OrderBy(l => l.FromDate.Date);
        }

        [HttpGet]
        public IEnumerable<DateTime> GetLeaveDatesForEmployee(int employeeId, DateTime startDate, DateTime endDate)
        {
            return leaveService.GetLeaveDatesForEmployee(employeeId, startDate, endDate);
        }

        [HttpDelete]
        public async Task DeleteLeave(int leaveId)
        {
            await leaveService.DeleteLeave(leaveId);
        }
    }
}
