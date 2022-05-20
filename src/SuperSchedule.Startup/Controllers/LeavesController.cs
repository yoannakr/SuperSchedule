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
        public async Task CreateLeave([FromBody] LeaveModel leaveModel)
        {
            await leaveService.CreateLeave(new Leave
            {
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
            return leaveService.GetLeavesForEmployee(employeeId, startDate, endDate).Select(leave =>
               new LeaveModel
               {
                   Id = leave.Id,
                   FromDate = leave.FromDate,
                   ToDate = leave.ToDate,
                   LeaveTypeId = (int)leave.LeaveType,
                   Comment = leave.Comment
               });
        }
    }
}
