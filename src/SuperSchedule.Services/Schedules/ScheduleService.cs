using SuperSchedule.Database.Enums;
using SuperSchedule.Database.Models;
using SuperSchedule.Database.Repositories.Schedules;
using SuperSchedule.Services.Employees;
using SuperSchedule.Services.Leaves;
using SuperSchedule.Services.Locations;
using SuperSchedule.Services.Settings;
using SuperSchedule.Services.ShiftTypes;
using System.Globalization;

namespace SuperSchedule.Services.Schedules
{
    public class ScheduleService : IScheduleService
    {
        private readonly ILocationService locationService;
        private readonly IShiftTypeService shiftTypeService;
        private readonly ISettingsService settingsService;
        private readonly IScheduleRepository scheduleRepository;
        private readonly IEmployeeService employeeService;
        private readonly ILeaveService leaveService;

        public ScheduleService(ILocationService locationService, IShiftTypeService shiftTypeService, ISettingsService settingsService, IScheduleRepository scheduleRepository, IEmployeeService employeeService, ILeaveService leaveService)
        {
            this.locationService = locationService;
            this.shiftTypeService = shiftTypeService;
            this.settingsService = settingsService;
            this.scheduleRepository = scheduleRepository;
            this.employeeService = employeeService;
            this.leaveService = leaveService;
        }

        public async Task FillSchedulesForMonth(DateTime startDate, DateTime endDate)
        {
            var allLocations = locationService.GetAllLocations().OrderBy(l => l.Priority).ToList();

            foreach (var location in allLocations)
            {
                await FillScheduleForLocation(location, startDate, endDate);
            }
        }

        #region Twelve Hours Shift Type

        private void FillScheduleTwelveHoursTemplate(Location location, DateTime startDate, DateTime endDate, List<Schedule> schedules, IEnumerable<Employee> employees, List<IGrouping<int, Employee>> employeesGroupByPositionPriority, IGrouping<int, Employee> employeesWithHighestPositionPriority)
        {
            var otherEmployeesGroup = employeesGroupByPositionPriority.First();
            employeesGroupByPositionPriority.Remove(otherEmployeesGroup);

            FillScheduleWithHighestPositionPriorityEmployeesTwelveHoursTemplate(schedules, location, employeesWithHighestPositionPriority, otherEmployeesGroup, startDate, endDate);

            foreach (var employee in employeesWithHighestPositionPriority)
            {
                var countOfUnnecessaryShifts = GetCountOfUnnecessaryShifts(employee, startDate, schedules, ShiftTypesTemplate.TwelveHours);

                RemoveUnneccessaryShiftsTwelveHours(employee, location, schedules, countOfUnnecessaryShifts, otherEmployeesGroup);
                CheckWorkingHoursForWeek(employee, schedules);
            }

            FillAllScheduleDates(location, startDate, endDate, schedules, employees);
        }

        private void FillScheduleWithHighestPositionPriorityEmployeesTwelveHoursTemplate(List<Schedule> schedules, Location location, IGrouping<int, Employee>? employeesWithHighestPositionPriority, IGrouping<int, Employee> otherEmployeesGroup, DateTime startDate, DateTime endDate)
        {
            var previousMonth = startDate.AddMonths(-1);
            var isScheduleFilledForPreviousMonth = scheduleRepository.IsScheduleFilledForPreviousMonth(location.Id, previousMonth);

            var countOfMissedDays = 0;

            foreach (var employee in employeesWithHighestPositionPriority)
            {
                var startDateWithMissedDays = startDate.AddDays(countOfMissedDays);
                FillConreteScheduleTwelveHoursTemplate(schedules, location, startDateWithMissedDays, endDate, employee, isScheduleFilledForPreviousMonth);

                if (countOfMissedDays != 0)
                {
                    var firstDate = startDate.AddDays(countOfMissedDays - 1);
                    var lastDate = startDate;
                    FillScheduleOpposite(schedules, location, firstDate, lastDate, employee);
                }
                countOfMissedDays += isScheduleFilledForPreviousMonth ? 0 : 2;

                if (leaveService.IsEmployeeHasLeavesForPeriod(employee.Id, startDate, endDate))
                {
                    ManageLeaves(schedules, location, otherEmployeesGroup, startDate, endDate, employee);
                }
            }
        }

        public void RemoveUnneccessaryShiftsTwelveHours(Employee employee, Location location, List<Schedule> schedules, double unnecessaryShifts, IGrouping<int, Employee?> otherGroupEmployees)
        {
            var schedulesForEmployee = schedules.Where(s => s.Employee == employee).OrderBy(s => s.Date.Date).ToList();
            var defaultBreakShiftType = shiftTypeService.GetDefaultBreakShiftType();
            var shiftTypeHighestPriority = schedulesForEmployee.Where(s => s.ShiftType?.Location?.Id == location.Id).OrderBy(s => s.ShiftType?.Priority).First()?.ShiftType?.Priority;
            var schedulesWithShiftTypeHighestPriority = schedulesForEmployee.Where(s => s.ShiftType?.Location?.Id == location.Id && s.ShiftType.Priority == shiftTypeHighestPriority).ToList();
            var dates = schedulesWithShiftTypeHighestPriority.Select(s => s.Date);

            var tempUnnecessaryShifts = 0;
            foreach (var date in dates)
            {
                if (tempUnnecessaryShifts == unnecessaryShifts)
                {
                    return;
                }

                var previousSchedule = schedulesWithShiftTypeHighestPriority.FirstOrDefault(s => s.Date.Date == date.Date);
                if (previousSchedule == null)
                {
                    continue;
                }

                var previousShiftType = previousSchedule.ShiftType;
                var otherEmployee = GetOtherEmployee(schedules, otherGroupEmployees, previousShiftType, date);
                if (otherEmployee == null)
                {
                    continue;
                }

                previousSchedule.ShiftType = defaultBreakShiftType;
                previousSchedule.RemovedShiftType = previousShiftType;

                FillSchedule(schedules, location, otherEmployee, date, previousShiftType);

                tempUnnecessaryShifts++;
            }
        }

        private void FillConreteScheduleTwelveHoursTemplate(List<Schedule> schedules, Location location, DateTime startDate, DateTime endDate, Employee employee, bool isScheduleFilledForPreviousMonth)
        {
            var allShiftTypes = shiftTypeService.GetShiftTypesByLocation(location.Id).ToList();
            var countOfShiftTypes = allShiftTypes.Count;

            var currentShiftTypeIndex = 0;
            var tempRotationDays = 0;
            if (isScheduleFilledForPreviousMonth)
            {
                var (nextShiftTypeIndex, lastRotationDays) = GetNextShiftTypeForTwelveHoursTemplate(location.Id, startDate.AddDays(-1), allShiftTypes, employee);
                currentShiftTypeIndex = nextShiftTypeIndex;
                tempRotationDays = lastRotationDays ?? 0;
            }
            var rotationDays = allShiftTypes[currentShiftTypeIndex].RotationDays;

            var tempDate = startDate;
            while (tempDate.Date <= endDate.Date)
            {
                if (tempRotationDays == rotationDays)
                {
                    currentShiftTypeIndex++;
                    tempRotationDays = 0;

                    if (currentShiftTypeIndex >= countOfShiftTypes)
                    {
                        currentShiftTypeIndex = 0;
                    }

                    rotationDays = allShiftTypes[currentShiftTypeIndex].RotationDays;
                }

                var currentShiftType = shiftTypeService.GetShiftTypeById(allShiftTypes[currentShiftTypeIndex].Id);

                if (!CanHaveShiftTypeOnGivenDay(location, tempDate, employee, currentShiftType, schedules))
                {
                    tempDate = tempDate.AddDays(1);
                    tempRotationDays += 1;
                    continue;
                }

                FillSchedule(schedules, location, employee, tempDate, currentShiftType, lastRotationDays: tempRotationDays + 1);

                tempRotationDays += 1;
                tempDate = tempDate.AddDays(1);
            }
        }

        private void FillScheduleOpposite(List<Schedule> schedules, Location location, DateTime startDate, DateTime endDate, Employee employee)
        {
            var shiftTypesOrderByDescending = shiftTypeService.GetShiftTypesByLocation(location.Id).OrderByDescending(s => s.Priority).ToList();
            var countOfShiftTypes = shiftTypesOrderByDescending.Count;

            var currentShiftTypeIndex = 0;
            var tempRotationDays = 0;
            var rotationDays = shiftTypesOrderByDescending[currentShiftTypeIndex].RotationDays;

            var tempDate = startDate;
            while (tempDate.Date >= endDate.Date)
            {
                if (tempRotationDays == rotationDays)
                {
                    currentShiftTypeIndex++;
                    tempRotationDays = 0;

                    if (currentShiftTypeIndex >= countOfShiftTypes)
                    {
                        currentShiftTypeIndex = 0;
                    }

                    rotationDays = shiftTypesOrderByDescending[currentShiftTypeIndex].RotationDays;
                }

                var currentShiftType = shiftTypeService.GetShiftTypeById(shiftTypesOrderByDescending[currentShiftTypeIndex].Id);

                if (!CanHaveShiftTypeOnGivenDay(location, tempDate, employee, currentShiftType, schedules))
                {
                    tempDate = tempDate.AddDays(-1);
                    tempRotationDays++;
                    continue;
                }

                FillSchedule(schedules, location, employee, tempDate, currentShiftType);

                tempRotationDays += 1;
                tempDate = tempDate.AddDays(-1);
            }
        }

        private (int, int?) GetNextShiftTypeForTwelveHoursTemplate(int id, DateTime lastDayOfPreviousMonth, List<ShiftType> allShiftTypes, Employee employee)
        {
            var maxShiftTypePriority = allShiftTypes.Max(s => s.Priority);
            var minShiftTypePriority = allShiftTypes.Min(s => s.Priority);
            var lastScheduleOfPreviousMonth = scheduleRepository.GetEmployeeScheduleByLocationForDate(id, lastDayOfPreviousMonth, employee);
            if (lastScheduleOfPreviousMonth == null)
            {
                return (-1, null);
            }

            var currentPriorityShiftType = lastScheduleOfPreviousMonth?.ShiftType?.Priority;
            var lastRotationDays = lastScheduleOfPreviousMonth?.LastRotationDays;
            if (shiftTypeService.IsShiftTypeBreak(lastScheduleOfPreviousMonth?.ShiftType) ||
                shiftTypeService.IsShiftTypeLeave(lastScheduleOfPreviousMonth?.ShiftType))
            {
                currentPriorityShiftType = lastScheduleOfPreviousMonth?.RemovedShiftType?.Priority;   
            }

            if (lastRotationDays == lastScheduleOfPreviousMonth?.ShiftType?.RotationDays)
            {
                currentPriorityShiftType++;
                lastRotationDays = 0;
                if (currentPriorityShiftType > maxShiftTypePriority)
                {
                    currentPriorityShiftType = minShiftTypePriority;
                }
            }

            var shiftTypeWithGivenPriority = allShiftTypes.FirstOrDefault(s => s.Priority == currentPriorityShiftType);
            var indexOfShiftType = allShiftTypes.IndexOf(shiftTypeWithGivenPriority);

            return (indexOfShiftType, lastRotationDays);
        }

        #endregion //Twelve Hours Shift Type

        #region First And Second Shift Type

        private void FillScheduleFirstAndSecondShiftsTemplate(List<Schedule> schedules, Location location, IEnumerable<Employee> employees, List<IGrouping<int, Employee>> employeesGroupByPositionPriority, IGrouping<int, Employee>? employeesWithHighestPositionPriority, DateTime startDate, DateTime endDate)
        {
            var dates = GetRangeOfDates(0, startDate, endDate);

            var datesGroupedByWeek = dates.GroupBy(x => CultureInfo.CurrentCulture.DateTimeFormat.Calendar.GetWeekOfYear(x, CalendarWeekRule.FirstFullWeek, DayOfWeek.Monday)).ToList();
            var allShiftTypes = shiftTypeService.GetShiftTypesByLocation(location.Id).OrderBy(s => s.Priority).ToList();

            var otherEmployeesGroup = employeesGroupByPositionPriority.First();
            employeesGroupByPositionPriority.Remove(otherEmployeesGroup);

            var firstShiftIndex = 0;
            foreach (var employee in employeesWithHighestPositionPriority)
            {
                FillScheduleHighestEmployeesFirstAndSecondShiftsTemplate(schedules, location, datesGroupedByWeek, allShiftTypes, employee, firstShiftIndex);
                if (leaveService.IsEmployeeHasLeavesForPeriod(employee.Id, startDate, endDate))
                {
                    ManageLeaves(schedules, location, otherEmployeesGroup, startDate, endDate, employee);
                }
                firstShiftIndex++;
                if (firstShiftIndex >= allShiftTypes.Count)
                {
                    firstShiftIndex = 0;
                }
            }

            foreach (var employee in employeesWithHighestPositionPriority)
            {
                var countOfUnnecessaryShifts = GetCountOfUnnecessaryShifts(employee, startDate, schedules, ShiftTypesTemplate.FirstAndSecondShifts);

                RemoveUnneccessaryFirstAndSecondShiftsTemplate(employee, location, schedules, countOfUnnecessaryShifts, otherEmployeesGroup, datesGroupedByWeek, allShiftTypes);
                CheckWorkingHoursForWeek(employee, schedules);
            }

            FillAllScheduleDates(location, startDate, endDate, schedules, employees);
        }

        private void FillScheduleHighestEmployeesFirstAndSecondShiftsTemplate(List<Schedule> schedules, Location location, List<IGrouping<int, DateTime>> datesGroupedByWeek, List<ShiftType> allShiftTypes, Employee employee, int firstShiftIndex)
        {
            var firstDateOfMonth = datesGroupedByWeek.First().First();

            var currentShiftTypeIndex = GetNextShiftTypeForFirstAndSecondShiftsTemplate(location.Id, firstDateOfMonth, allShiftTypes, employee);
            if (currentShiftTypeIndex == -1)
            {
                currentShiftTypeIndex = firstShiftIndex;
            }

            var countOfShiftTypes = allShiftTypes.Count;

            foreach (var week in datesGroupedByWeek)
            {
                var currentShiftType = shiftTypeService.GetShiftTypeById(allShiftTypes[currentShiftTypeIndex].Id);

                foreach (var date in week)
                {
                    if (!CanHaveShiftTypeOnGivenDay(location, date, employee, currentShiftType, schedules))
                    {
                        continue;
                    }

                    FillSchedule(schedules, location, employee, date, currentShiftType);
                }

                currentShiftTypeIndex++;
                if (currentShiftTypeIndex >= countOfShiftTypes)
                {
                    currentShiftTypeIndex = 0;
                }
            }
        }

        public void RemoveUnneccessaryFirstAndSecondShiftsTemplate(Employee employee, Location location, List<Schedule> schedules, double unnecessaryShifts, IGrouping<int, Employee?> otherGroupEmployees, List<IGrouping<int, DateTime>> datesGroupedByWeek, List<ShiftType> allShiftTypes)
        {
            var firstShift = allShiftTypes[0];
            var secondShift = allShiftTypes[1];
            var schedulesForEmployee = schedules.Where(s => s.Employee == employee).OrderBy(s => s.Date.Date).ToList();
            var defaultBreakShiftType = shiftTypeService.GetDefaultBreakShiftType();
            var firstDateOfMonth = datesGroupedByWeek.First().First();
            var currentDayOfWeekTemplate = DayOfWeekTemplate.MondayAndTuesday;
            var usedWeekIndex = new List<int>();
            Employee? otherEmployee = null;

            var tempUnnecessaryShifts = 0;
            var dateGroupIndex = 0;
            while (tempUnnecessaryShifts != unnecessaryShifts)
            {
                if (otherGroupEmployees.Count() == 1 && otherGroupEmployees.First()?.Locations.Count != 1)
                {
                    otherEmployee = otherGroupEmployees.First();
                    currentDayOfWeekTemplate = GetNextDayOfWeekTemplate(location.Id, otherEmployee, firstDateOfMonth);

                }
                dateGroupIndex++;
                if (datesGroupedByWeek.Count <= dateGroupIndex)
                {
                    dateGroupIndex = 0;
                }
                var dateFromWeek = currentDayOfWeekTemplate == DayOfWeekTemplate.MondayAndTuesday ?
                                                        GetMondayAndTuesdayFromWeek(datesGroupedByWeek[dateGroupIndex]) :
                                                        GetFridayAndSaturdayFromWeek(datesGroupedByWeek[dateGroupIndex]);

                if (dateFromWeek.Count != 2 || usedWeekIndex.Contains(dateGroupIndex))
                {
                    dateGroupIndex = dateGroupIndex + 1;
                    if (datesGroupedByWeek.Count <= dateGroupIndex)
                    {
                        dateGroupIndex = 0;
                    }

                    dateFromWeek = currentDayOfWeekTemplate == DayOfWeekTemplate.MondayAndTuesday ?
                                                        GetMondayAndTuesdayFromWeek(datesGroupedByWeek[dateGroupIndex]) :
                                                        GetFridayAndSaturdayFromWeek(datesGroupedByWeek[dateGroupIndex]);
                    if (dateFromWeek.Count != 2 || usedWeekIndex.Contains(dateGroupIndex))
                    {
                        return;
                    }
                }
                usedWeekIndex.Add(dateGroupIndex);
                dateFromWeek = dateFromWeek.OrderBy(d => d.Date).ToList();
                var previousShiftType = schedulesForEmployee.FirstOrDefault(s => s.Date.Date == dateFromWeek[0].Date)?.ShiftType;
                if(shiftTypeService.IsShiftTypeBreak(previousShiftType) || shiftTypeService.IsShiftTypeLeave(previousShiftType))
                {
                    continue;
                }

                if (previousShiftType?.Id == firstShift.Id)
                {
                    var date = dateFromWeek[0];
                    otherEmployee = GetOtherEmployee(schedules, otherGroupEmployees, previousShiftType, date);
                    if (otherEmployee == null)
                    {
                        continue;
                    }

                    var previousSchedule = schedulesForEmployee.First(s => s.Date.Date == date.Date);
                    previousSchedule.ShiftType = defaultBreakShiftType;
                    previousSchedule.RemovedShiftType = previousShiftType;

                    FillSchedule(schedules, location, otherEmployee, date, previousShiftType, dayOfWeekTemplate: currentDayOfWeekTemplate);

                    tempUnnecessaryShifts++;
                }
                else
                {
                    var date = dateFromWeek[1];
                    otherEmployee = GetOtherEmployee(schedules, otherGroupEmployees, previousShiftType, date);
                    if (otherEmployee == null)
                    {
                        continue;
                    }

                    schedulesForEmployee.First(s => s.Date.Date == date.Date).ShiftType = defaultBreakShiftType;
                    FillSchedule(schedules, location, otherEmployee, date, previousShiftType, dayOfWeekTemplate: currentDayOfWeekTemplate);

                    tempUnnecessaryShifts++;
                }
            }
        }

        private int GetNextShiftTypeForFirstAndSecondShiftsTemplate(int locationId, DateTime startDate, List<ShiftType> allShiftTypes, Employee employee)
        {
            if (startDate.DayOfWeek != DayOfWeek.Monday && startDate.DayOfWeek != DayOfWeek.Saturday && startDate.DayOfWeek != DayOfWeek.Sunday)
            {
                var previousMonthSchedule = scheduleRepository.GetEmployeeScheduleByLocationForDate(locationId, startDate.AddDays(-1), employee);
                if (previousMonthSchedule == null)
                {
                    return -1;
                }

                var lastMonthShiftTypeId = previousMonthSchedule.ShiftType?.Id;
                if(shiftTypeService.IsShiftTypeBreak(previousMonthSchedule.ShiftType) ||
                    shiftTypeService.IsShiftTypeLeave(previousMonthSchedule.ShiftType))
                {
                    lastMonthShiftTypeId = previousMonthSchedule.RemovedShiftType?.Id;
                }
                var lastMonthShiftType = allShiftTypes.FirstOrDefault(s => s.Id == lastMonthShiftTypeId);

                return allShiftTypes.IndexOf(lastMonthShiftType);
            }

            var previousMonth = startDate.AddMonths(-1);
            var dates = GetAllMonthDays(previousMonth);

            var mondays = dates.Where(d => d.DayOfWeek == DayOfWeek.Monday).OrderBy(d => d.Date).ToList();
            var lastMonday = mondays.Last();

            if (startDate.DayOfWeek == DayOfWeek.Saturday || startDate.DayOfWeek == DayOfWeek.Sunday)
            {
                lastMonday = mondays[mondays.Count() - 2];
            }

            var lastMondaySchedule = scheduleRepository.GetEmployeeScheduleByLocationForDate(locationId, lastMonday, employee);
            if (lastMondaySchedule == null)
            {
                return -1;
            }

            var shiftTypeId = lastMondaySchedule.ShiftType?.Id;
            while (shiftTypeId == 1)
            {
                lastMonday = lastMonday.AddDays(1);
                lastMondaySchedule = scheduleRepository.GetEmployeeScheduleByLocationForDate(locationId, lastMonday, employee);
                shiftTypeId = lastMondaySchedule.ShiftType?.Id;
            }

            var shiftTypeModel = allShiftTypes.FirstOrDefault(s => s.Id == shiftTypeId);
            var indexOfShiftType = allShiftTypes.IndexOf(shiftTypeModel);
            var nextShiftType = indexOfShiftType + 1;

            if (nextShiftType == allShiftTypes.Count)
            {
                return 0;
            }

            return nextShiftType;

            // ako meseca zapochva ot ponedelnik trqbwa da vidim posledniq ponedelnik i obrushtame
            // ako meseca zapochva ot drug den trqbwa da vidim posledniq ponedelnik i ne obrustame
            // ako meseca zapochva v subota ili nedelq trqbwa da vidim predposledniq ponedelnik i obrustame

        }

        #endregion // First And Second Shift Type

        #region One Shift Type

        private void FillScheduleOneShiftTemplate(List<Schedule> schedules, Location location, IEnumerable<Employee> employees, List<IGrouping<int, Employee>> employeesGroupByPositionPriority, IGrouping<int, Employee> employeesWithHighestPositionPriority, DateTime startDate, DateTime endDate)
        {
            var allShiftTypes = shiftTypeService.GetShiftTypesByLocation(location.Id).OrderBy(s => s.Priority).ToList();
            if (!allShiftTypes.Any())
            {
                return;
            }

            foreach (var employee in employeesWithHighestPositionPriority)
            {
                FillScheduleHighestEmployeesOneShiftTemplate(schedules, location, startDate, endDate, allShiftTypes, employee);
            }

            var otherEmployeesGroup = employeesGroupByPositionPriority.First();
            employeesGroupByPositionPriority.Remove(otherEmployeesGroup);

            foreach (var employee in employeesWithHighestPositionPriority)
            {
                var countOfUnnecessaryShifts = GetCountOfUnnecessaryShifts(employee, startDate, schedules, ShiftTypesTemplate.OneShift);

                RemoveUnneccessaryOneShiftTemplate(employee, location, schedules, startDate, endDate, countOfUnnecessaryShifts, otherEmployeesGroup);
                CheckWorkingHoursForWeek(employee, schedules);
            }

            FillAllScheduleDates(location, startDate, endDate, schedules, employees);
        }

        private void FillScheduleHighestEmployeesOneShiftTemplate(List<Schedule> schedules, Location location, DateTime startDate, DateTime endDate, List<ShiftType> allShiftTypes, Employee employee)
        {
            var currentShiftType = shiftTypeService.GetShiftTypeById(allShiftTypes[0].Id);

            var tempDate = startDate.Date;
            while (tempDate.Date <= endDate.Date)
            {
                if (!CanHaveShiftTypeOnGivenDay(location, tempDate, employee, currentShiftType, schedules))
                {
                    tempDate = tempDate.AddDays(1);
                    continue;
                }

                FillSchedule(schedules, location, employee, tempDate, currentShiftType);

                tempDate = tempDate.AddDays(1);
            }
        }

        private void RemoveUnneccessaryOneShiftTemplate(Employee employee, Location location, List<Schedule> schedules, DateTime startDate, DateTime endDate, double countOfUnnecessaryShifts, IGrouping<int, Employee> otherEmployeesGroup)
        {
            var schedulesForEmployee = schedules.Where(s => s.Employee == employee).OrderBy(s => s.Date.Date).ToList();
            var defaultBreakShiftType = shiftTypeService.GetDefaultBreakShiftType();

            var tempCountOfUnnecessaryShifts = 0;
            var tempDate = startDate.Date;
            while (tempDate.Date <= endDate.Date)
            {
                if (tempCountOfUnnecessaryShifts == countOfUnnecessaryShifts)
                {
                    break;
                }

                var previousShiftType = schedulesForEmployee.FirstOrDefault(s => s.Date.Date == tempDate.Date)?.ShiftType;
                var otherEmployee = GetOtherEmployee(schedules, otherEmployeesGroup, previousShiftType, tempDate);
                if (otherEmployee != null)
                {
                    tempCountOfUnnecessaryShifts++;
                    schedulesForEmployee.First(s => s.Date.Date == tempDate.Date).ShiftType = defaultBreakShiftType;

                    FillSchedule(schedules, location, otherEmployee, tempDate, previousShiftType);
                }

                tempDate = tempDate.AddDays(1);
            }
        }

        #endregion // One Shift Type

        #region Common

        public async Task FillScheduleForLocation(Location location, DateTime startDate, DateTime endDate)
        {
            var schedules = new List<Schedule>();

            var employees = employeeService.GetEmployeeByLocation(location.Id);
            var employeesGroupByPositionPriority = employees.OrderBy(e => e.Position.Priority).GroupBy(e => e.Position.Priority).ToList();
            var employeesWithHighestPositionPriority = employeesGroupByPositionPriority.First();
            employeesGroupByPositionPriority.Remove(employeesWithHighestPositionPriority);

            var workingHours = CalculateWorkingHoursForMonth(startDate);
            switch (location.ShiftTypesTemplate)
            {
                case ShiftTypesTemplate.TwelveHours:
                    {
                        FillScheduleTwelveHoursTemplate(location, startDate, endDate, schedules, employees, employeesGroupByPositionPriority, employeesWithHighestPositionPriority);
                        break;
                    }
                case ShiftTypesTemplate.FirstAndSecondShifts:
                    {
                        FillScheduleFirstAndSecondShiftsTemplate(schedules, location, employees, employeesGroupByPositionPriority, employeesWithHighestPositionPriority, startDate, endDate);
                        break;
                    }
                case ShiftTypesTemplate.OneShift:
                    {
                        FillScheduleOneShiftTemplate(schedules, location, employees, employeesGroupByPositionPriority, employeesWithHighestPositionPriority, startDate, endDate);
                        break;
                    }
                default:
                    break;
            }
            await scheduleRepository.CreateSchedule(schedules);
        }

        private void FillSchedule(List<Schedule> schedules, Location location, Employee employee, DateTime tempDate, ShiftType? currentShiftType = null, int? lastRotationDays = null, DayOfWeekTemplate? dayOfWeekTemplate = null)
        {
            schedules.Add(new Schedule
            {
                Location = location,
                Employee = employee,
                ShiftType = currentShiftType,
                Date = tempDate,
                LastRotationDays = lastRotationDays,
                DayOfWeekTemplate = dayOfWeekTemplate
            });
        }

        private void FillAllScheduleDates(Location location, DateTime startDate, DateTime endDate, List<Schedule> schedules, IEnumerable<Employee> employees)
        {
            foreach (var employee in employees)
            {
                var schedulesForEmployee = schedules.Where(s => s.Employee?.Id == employee.Id).ToList();
                var countOfMonthDays = (endDate.Date - startDate.Date).TotalDays + 1;
                var countOfFilledDays = schedulesForEmployee.Count();

                if (countOfFilledDays != countOfMonthDays)
                {
                    var filledDays = schedulesForEmployee.Select(s => s.Date.Date).ToList();
                    var tempDate = startDate;
                    while (tempDate.Date <= endDate.Date)
                    {
                        if (filledDays.Contains(tempDate.Date))
                        {
                            tempDate = tempDate.AddDays(1);
                            continue;
                        }

                        FillSchedule(schedules, location, employee, tempDate);

                        tempDate = tempDate.AddDays(1);
                    }
                }
            }
        }

        private IEnumerable<DateTime> GetRangeOfDates(int start, DateTime startDate, DateTime endDate)
        {
            return Enumerable.Range(start, 1 + endDate.Subtract(startDate).Days)
                                    .Select(offset => startDate.AddDays(offset))
                                    .ToList();
        }

        private IEnumerable<DateTime> GetAllMonthDays(DateTime monthDate)
        {
            return Enumerable.Range(1, DateTime.DaysInMonth(monthDate.Year, monthDate.Month))  // Days: 1, 2 ... 31 etc.
                             .Select(day => new DateTime(monthDate.Year, monthDate.Month, day)) // Map each day to a date
                             .ToList(); // Load dates into a list;
        }

        public int CalculateWorkingHoursForMonth(DateTime dateTime)
        {
            var holidays = settingsService.GetSettings().Holidays.ToList();
            var firstDayOfMonth = new DateTime(dateTime.Year, dateTime.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            var tempDate = firstDayOfMonth;
            int countOfWorkingDays = 0;
            while (tempDate <= lastDayOfMonth)
            {
                if (tempDate.DayOfWeek != DayOfWeek.Saturday
                    && tempDate.DayOfWeek != DayOfWeek.Sunday
                    && !holidays.Any(h => h.Date == tempDate.Date))
                {
                    countOfWorkingDays++;
                }

                tempDate = tempDate.AddDays(1);
            }

            return countOfWorkingDays * 8;
        }

        private void ManageLeaves(List<Schedule> schedules, Location location, IGrouping<int, Employee> otherEmployeesGroup, DateTime startDate, DateTime endDate, Employee employee)
        {
            // вземам всички дати, за всяка дата вземам новия employee и сетвам с приоритет -1 смяната
            var leaves = leaveService.GetLeavesForEmployee(employee.Id, startDate, endDate);
            var leaveDates = leaves.SelectMany(l => GetRangeOfDates(0, l.FromDate, l.ToDate)).ToList();
            var monthDates = GetAllMonthDays(startDate);

            var leaveWorkDaysShiftType = shiftTypeService.GetDefaultLeaveWorkDaysShiftType();
            var leaveWeekendDaysShiftType = shiftTypeService.GetDefaultLeaveWeekendDaysShiftType();
            var currentMonthLeaveDates = monthDates.Where(d => leaveDates.Any(l => l.Date == d.Date)).ToList();

            if(currentMonthLeaveDates.Count() == 0)
            {
                return;
            }

            foreach (var leaveDate in currentMonthLeaveDates)
            {
                var currentLeaveShiftType = IsWeekendDate(leaveDate) ? leaveWeekendDaysShiftType : leaveWorkDaysShiftType;

                var schedule = schedules.FirstOrDefault(s => s.Employee.Id == employee.Id && s.Date.Date == leaveDate.Date);
                var previousShiftType = schedule?.ShiftType;
                if (schedule == null || previousShiftType == null || shiftTypeService.IsShiftTypeLeave(previousShiftType))
                {
                    continue;
                }

                if (shiftTypeService.IsShiftTypeBreak(previousShiftType) || previousShiftType.TotalHours <= 0) 
                {
                    schedule.ShiftType = currentLeaveShiftType;
                    continue;
                }

                var otherEmployee = GetOtherEmployee(schedules, otherEmployeesGroup, previousShiftType, leaveDate);
                if (otherEmployee == null)
                {
                    // съобщение
                    continue;
                }

                schedule.ShiftType = currentLeaveShiftType;
                schedule.RemovedShiftType = previousShiftType;

                FillSchedule(schedules, location, otherEmployee, leaveDate, previousShiftType);
            }
        }

        private bool IsWeekendDate(DateTime leaveDate)
        {
            if (leaveDate.DayOfWeek == DayOfWeek.Sunday || leaveDate.DayOfWeek == DayOfWeek.Saturday)
            {
                return true;
            }

            return false;
        }

        private DayOfWeekTemplate GetNextDayOfWeekTemplate(int locationId, Employee employee, DateTime firstDateOfMonth)
        {
            var otherLocation = employee.Locations.First(l => l.Id != locationId);
            var previousMonthSchedule = scheduleRepository.GetDayOfWeekTemplateForMonth(locationId, firstDateOfMonth.AddDays(-1), employee);
            DayOfWeekTemplate oppositeDayOfWeekTemplate;
            if (previousMonthSchedule == null)
            {
                var otherLocationCurrentMonthSchedule = scheduleRepository.GetDayOfWeekTemplateForMonth(otherLocation.Id, firstDateOfMonth, employee);
                if (otherLocationCurrentMonthSchedule == null)
                {
                    return DayOfWeekTemplate.MondayAndTuesday;
                }

                oppositeDayOfWeekTemplate = GetOppositeDayOfWeekTemplate(otherLocationCurrentMonthSchedule);

                return oppositeDayOfWeekTemplate;
            }
            oppositeDayOfWeekTemplate = GetOppositeDayOfWeekTemplate(previousMonthSchedule);

            return oppositeDayOfWeekTemplate;
        }

        private DayOfWeekTemplate GetOppositeDayOfWeekTemplate(DayOfWeekTemplate? dayOfWeekTemplate)
        {
            switch (dayOfWeekTemplate)
            {
                case DayOfWeekTemplate.FridayAndSaturday:
                    return DayOfWeekTemplate.MondayAndTuesday;
                case DayOfWeekTemplate.MondayAndTuesday:
                    return DayOfWeekTemplate.FridayAndSaturday;
            }

            return DayOfWeekTemplate.MondayAndTuesday;
        }

        public bool CanHaveShiftTypeOnGivenDay(Location location, DateTime date, Employee employee, ShiftType shiftType, List<Schedule> schedules)
        {
            if (location.ShiftTypesTemplate != ShiftTypesTemplate.TwelveHours)
            {
                var holidaysDates = settingsService.GetSettings().Holidays.Select(h => h.Date);

                // ако е официален почивен ден 
                if (holidaysDates.Contains(date.Date))
                {
                    FillWithBreak(location, date, employee, schedules);
                    return false;
                }
            }

            // ако смяната не може в този ден от седмицата
            var dayOfWeek = (int)date.DayOfWeek + 1;
            var days = shiftType.Days.Select(d => d.Id);
            if (!days.Contains(dayOfWeek))
            {
                FillWithBreak(location, date, employee, schedules);
                return false;
            }

            return true;
        }

        public double GetCountOfUnnecessaryShifts(Employee employee, DateTime startDate, List<Schedule> schedules, ShiftTypesTemplate shiftTypesTemplate)
        {
            var shiftHours = (shiftTypesTemplate == ShiftTypesTemplate.TwelveHours || shiftTypesTemplate == ShiftTypesTemplate.OneShift) ? 12 : 8;
            var workingHoursForMonth = CalculateWorkingHoursForMonth(startDate);
            var schedulesOfEmployee = schedules.Where(s => s.Employee == employee).ToList();
            var totalWorkingHours = schedulesOfEmployee.Sum(t => t.ShiftType.TotalHours);
            var overWorkingHours = totalWorkingHours - workingHoursForMonth;
            var unnecessaryShifts = Math.Floor(overWorkingHours / shiftHours);

            return unnecessaryShifts;
        }

        private List<DateTime> GetMondayAndTuesdayFromWeek(IGrouping<int, DateTime> week)
        {
            var holidaysDates = settingsService.GetSettings().Holidays.Select(h => h.Date);

            var result = new List<DateTime>();
            foreach (var date in week)
            {
                if (result.Count == 2)
                    break;

                if (date.DayOfWeek != DayOfWeek.Monday && date.DayOfWeek != DayOfWeek.Tuesday)
                    continue;

                if (holidaysDates.Contains(date.Date))
                    continue;

                result.Add(date.Date);
            }

            return result;
        }

        private List<DateTime> GetFridayAndSaturdayFromWeek(IGrouping<int, DateTime> week)
        {
            var holidaysDates = settingsService.GetSettings().Holidays.Select(h => h.Date);
            var reverseWeekWithoutSunday = week.OrderByDescending(h => h.Date).Where(d => d.DayOfWeek != DayOfWeek.Sunday);
            var result = new List<DateTime>();
            foreach (var date in reverseWeekWithoutSunday)
            {
                if (result.Count == 2)
                    break;

                if (date.DayOfWeek != DayOfWeek.Friday && date.DayOfWeek != DayOfWeek.Saturday)
                    continue;

                if (holidaysDates.Contains(date.Date))
                    continue;

                result.Add(date.Date);
            }

            return result;
        }

        private Employee? GetOtherEmployee(List<Schedule> schedules, IGrouping<int, Employee?> employees, ShiftType shiftType, DateTime date)
        {
            foreach (var employee in employees)
            {
                var contextEmployee = employeeService.GetEmployeeById(employee.Id);
                // свободен ли е за този ден служителя
                if (!IsEmployeeAvailable(date, contextEmployee, schedules))
                {
                    continue;
                }

                // може ли да бъде тази смяна
                if (!CanEmployeeWorkShiftType(contextEmployee, shiftType))
                {
                    continue;
                }

                // дали е в отпуска или болничен тогава
                if (leaveService.IsEmployeeHasLeavesForDate(contextEmployee.Id, date))
                {
                    continue;
                }

                var previousDateShiftType = scheduleRepository.GetEmployeeScheduleForDate(date, employee)?.ShiftType;
                // дали ще се засекат двете смени
                if (previousDateShiftType != null && previousDateShiftType.EndTime == shiftType.EndTime)
                {
                    continue;
                }

                var weekHoursWithHoursFromNewShiftType = GetWorkingHoursForWeek(contextEmployee, schedules, date) + shiftType.TotalHours;
                var maxHoursPerWeek = settingsService.GetSettings().MaxHoursPerWeek;

                // проверка за седмичните часове дали ще се надвишат ако се добавят часовете от смяната която трябва да вземе 
                if (weekHoursWithHoursFromNewShiftType > maxHoursPerWeek)
                {
                    continue;
                }

                return employee;

            }

            return null;
        }

        private bool CanEmployeeWorkShiftType(Employee employee, ShiftType shiftType)
        {
            var shiftTypesIds = employee.ShiftTypes.Select(s => s.Id).ToList();
            if (shiftTypesIds.Contains(shiftType.Id))
            {
                return true;
            }

            return false;
        }

        public bool IsEmployeeAvailable(DateTime date, Employee employee, List<Schedule> schedules)
        {
            var newSchedulesForEmployee = schedules.Where(s => s.Employee.Id == employee.Id && s.Date.Date == date.Date && s.ShiftType != null).ToList();
            
            return newSchedulesForEmployee.Count() == 0 && scheduleRepository.IsEmployeeAvailable(date, employee);
        }

        public bool IsEmployeeWorkLastFourDays(DateTime date, Employee employee, List<Schedule> schedulers)
        {
            return schedulers.Where(s => s.Date >= date.AddDays(-4) && s.Date <= date && s.Employee == employee).Count() == 4;
        }

        public void FillWithBreak(Location location, DateTime date, Employee employee, List<Schedule> schedules)
        {
            var breakShiftType = shiftTypeService.GetDefaultBreakShiftType();
            FillSchedule(schedules, location, employee, date, breakShiftType);
        }

        public DateTime GetFirstDateOfWeekFromDate(DateTime date)
        {
            var culture = CultureInfo.CurrentCulture;
            var diff = date.DayOfWeek - culture.DateTimeFormat.FirstDayOfWeek;
            if (diff < 0)
                diff += 7;
            date = date.AddDays(-diff).Date;

            return date;
        }

        public double GetWorkingHoursForWeek(Employee employee, List<Schedule> schedules, DateTime date)
        {
            var startDate = GetFirstDateOfWeekFromDate(date);
            var endDate = startDate.AddDays(6);
            var newSchedulesForEmployee = schedules.Where(s => s.Employee.Id == employee.Id && s.Date.Date >= startDate.Date && s.Date.Date <= endDate.Date).ToList();
            var schedulesForEmployee = scheduleRepository
                .GetEmployeeScheduleForPeriod(startDate, endDate, employee)
                .Union(newSchedulesForEmployee)
                .ToList();

            var weekHours = schedulesForEmployee.Sum(s => s.ShiftType?.TotalHours ?? 0);

            return weekHours;
        }

        public void CheckWorkingHoursForWeek(Employee employee, List<Schedule> schedules)
        {
            var schedulesForEmployee = schedules.Where(s => s.Employee == employee).OrderBy(s => s.Date.Date).ToList();
            var dates = schedulesForEmployee.Select(t => t.Date);
            var settingsWeekHours = settingsService.GetSettings().MaxHoursPerWeek;

            var datesGroupedByWeek = dates.GroupBy(x => CultureInfo.CurrentCulture.DateTimeFormat.Calendar.GetWeekOfYear(x, CalendarWeekRule.FirstFullWeek, DayOfWeek.Monday));

            foreach (var week in datesGroupedByWeek)
            {
                var startDate = week.First().Date;
                var endDate = week.Last().Date;

                var weekHours = schedulesForEmployee.Where(t => t.Date >= startDate && t.Date <= endDate).Sum(s => s.ShiftType.TotalHours);

                if (weekHours > settingsWeekHours)
                {
                    Console.WriteLine("Надвишаваш");
                }
            }

        }

        #endregion // Common

        public IEnumerable<Schedule> GetSchedulesByLocationForPeriod(int locationId, DateTime startDate, DateTime endDate)
        {
            return scheduleRepository.GetSchedulesByLocationForPeriod(locationId, startDate, endDate);
        }

        public async Task UpdateShiftTypeOfSchedules(List<Schedule> schedules)
        {
            foreach (var schedule in schedules)
            {
                if (schedule.ShiftType == null)
                {
                    continue;
                }

                var contextSchedule = scheduleRepository.GetScheduleById(schedule.Id);
                if (contextSchedule?.ShiftType?.Id == schedule?.ShiftType?.Id)
                {
                    continue;
                }

                await scheduleRepository.UpdateShiftTypeOfSchedules(contextSchedule, schedule.ShiftType.Id);
            }
        }


    }
}
