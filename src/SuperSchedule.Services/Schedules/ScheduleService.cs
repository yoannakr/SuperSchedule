using SuperSchedule.Database.Enums;
using SuperSchedule.Database.Models;
using SuperSchedule.Database.Repositories.Schedules;
using SuperSchedule.Services.Employees;
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

        public ScheduleService(ILocationService locationService, IShiftTypeService shiftTypeService, ISettingsService settingsService, IScheduleRepository scheduleRepository, IEmployeeService employeeService)
        {
            this.locationService = locationService;
            this.shiftTypeService = shiftTypeService;
            this.settingsService = settingsService;
            this.scheduleRepository = scheduleRepository;
            this.employeeService = employeeService;
        }

        public async Task FillSchedulesForMonth(DateTime startDate, DateTime endDate)
        {
            var allLocations = locationService.GetAllLocations();

            foreach (var location in allLocations)
            {
                await FillScheduleForLocation(location, startDate, endDate);
            }
        }

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
                case Database.Enums.ShiftTypesTemplate.TwelveHours:
                    {
                        FillScheduleTwelveHoursTemplate(location, startDate, endDate, schedules, employees, employeesGroupByPositionPriority, employeesWithHighestPositionPriority);
                        break;
                    }
                case Database.Enums.ShiftTypesTemplate.FirstAndSecondShifts:
                    {
                        FillScheduleFirstAndSecondShiftsTemplate(schedules, location, employees, employeesGroupByPositionPriority, employeesWithHighestPositionPriority, startDate, endDate);
                        break;
                    }
                default:
                    break;
            }


            await scheduleRepository.CreateSchedule(schedules);
        }

        private void FillScheduleTwelveHoursTemplate(Location location, DateTime startDate, DateTime endDate, List<Schedule> schedules, IEnumerable<Employee> employees, List<IGrouping<int, Employee>> employeesGroupByPositionPriority, IGrouping<int, Employee> employeesWithHighestPositionPriority)
        {
            FillScheduleWithHighestPositionPriorityEmployeesTwelveHoursTemplate(schedules, location, employeesWithHighestPositionPriority, startDate, endDate);
            var otherEmployeesGroup = employeesGroupByPositionPriority.First();
            employeesGroupByPositionPriority.Remove(otherEmployeesGroup);

            foreach (var employee in employeesWithHighestPositionPriority)
            {
                var countOfUnnecessaryShifts = GetCountOfUnnecessaryShifts(employee, startDate, schedules, ShiftTypesTemplate.TwelveHours);

                RemoveUnneccessaryShiftsTwelveHours(employee, location, schedules, countOfUnnecessaryShifts, otherEmployeesGroup);
                CheckWorkingHoursForWeek(employee, schedules);
            }

            FillAllScheduleDates(location, startDate, endDate, schedules, employees);
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

                        schedules.Add(new Schedule
                        {
                            Location = location,
                            Employee = employee,
                            Date = tempDate
                        });

                        tempDate = tempDate.AddDays(1);
                    }
                }
            }
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

        private void FillScheduleWithHighestPositionPriorityEmployeesTwelveHoursTemplate(List<Schedule> scheduler, Location location, IGrouping<int, Employee>? employeesWithHighestPositionPriority, DateTime startDate, DateTime endDate)
        {
            var previousMonth = startDate.AddMonths(-1);
            var isScheduleFilledForPreviousMonth = scheduleRepository.IsScheduleFilledForPreviousMonth(location.Id, previousMonth);

            var countOfMissedDays = 0;

            foreach (var employee in employeesWithHighestPositionPriority)
            {
                var startDateWithMissedDays = startDate.AddDays(countOfMissedDays);
                FillConreteScheduleTwelveHoursTemplate(scheduler, location, startDateWithMissedDays, endDate, employee, isScheduleFilledForPreviousMonth);

                if (countOfMissedDays != 0)
                {
                    var firstDate = startDate.AddDays(countOfMissedDays - 1);
                    var lastDate = startDate;
                    FillScheduleOpposite(scheduler, location, firstDate, lastDate, employee);
                }
                countOfMissedDays += isScheduleFilledForPreviousMonth ? 0 : 2;
            }
        }

        private void FillScheduleFirstAndSecondShiftsTemplate(List<Schedule> schedules, Location location, IEnumerable<Employee> employees, List<IGrouping<int, Employee>> employeesGroupByPositionPriority, IGrouping<int, Employee>? employeesWithHighestPositionPriority, DateTime startDate, DateTime endDate)
        {
            var dates = Enumerable.Range(0, 1 + endDate.Subtract(startDate).Days)
                                    .Select(offset => startDate.AddDays(offset))
                                    .ToList();

            var datesGroupedByWeek = dates.GroupBy(x => CultureInfo.CurrentCulture.DateTimeFormat.Calendar.GetWeekOfYear(x, CalendarWeekRule.FirstFullWeek, DayOfWeek.Monday)).ToList();
            var allShiftTypes = shiftTypeService.GetShiftTypesByLocation(location.Id).OrderBy(s => s.Priority).ToList();

            var firstShiftIndex = 0;
            foreach (var employee in employeesWithHighestPositionPriority)
            {
                FillScheduleHighestEmployeesFirstAndSecondShiftsTemplate(schedules, location, datesGroupedByWeek, allShiftTypes, employee, firstShiftIndex);
                firstShiftIndex++;
                if(firstShiftIndex >= allShiftTypes.Count)
                {
                    firstShiftIndex = 0;
                }
            }

            var otherEmployeesGroup = employeesGroupByPositionPriority.First();
            employeesGroupByPositionPriority.Remove(otherEmployeesGroup);

            foreach (var employee in employeesWithHighestPositionPriority)
            {
                var countOfUnnecessaryShifts = GetCountOfUnnecessaryShifts(employee, startDate, schedules, ShiftTypesTemplate.FirstAndSecondShifts);

                RemoveUnneccessaryFirstAndSecondShiftsTemplate(employee, location, schedules, countOfUnnecessaryShifts, otherEmployeesGroup, datesGroupedByWeek, allShiftTypes);
                CheckWorkingHoursForWeek(employee, schedules);
            }

            FillAllScheduleDates(location, startDate, endDate, schedules, employees);
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

                schedules.Add(new Schedule
                {
                    Location = location,
                    Employee = employee,
                    ShiftType = currentShiftType,
                    Date = tempDate,
                    LastRotationDays = tempRotationDays + 1,
                });

                tempRotationDays += 1;
                tempDate = tempDate.AddDays(1);
            }
        }

        private (int, int?) GetNextShiftTypeForTwelveHoursTemplate(int id, DateTime lastDayOfPreviousMonth, List<ShiftType> allShiftTypes, Employee employee)
        {
            var maxShiftTypePriority = allShiftTypes.Max(s => s.Priority);
            var minShiftTypePriority = allShiftTypes.Min(s => s.Priority);
            var lastScheduleOfPreviousMonth = scheduleRepository.GetEmployeeScheduleByLocationForDate(id, lastDayOfPreviousMonth, employee);
            if(lastScheduleOfPreviousMonth == null)
            {
                return (-1, null);
            }

            var tempDate = lastDayOfPreviousMonth;
            while(lastScheduleOfPreviousMonth?.ShiftType?.Id == 1)
            {
                lastScheduleOfPreviousMonth = scheduleRepository.GetEmployeeScheduleByLocationForDate(id, tempDate, employee);
                tempDate = tempDate.AddDays(-1);
            }

            var currentPriorityShiftType = lastScheduleOfPreviousMonth?.ShiftType?.Priority;
            var lastRotationDays = lastScheduleOfPreviousMonth?.LastRotationDays;

            if(lastRotationDays == lastScheduleOfPreviousMonth?.ShiftType?.RotationDays)
            {
                currentPriorityShiftType++;
                lastRotationDays = 0;
                if(currentPriorityShiftType > maxShiftTypePriority)
                {
                    currentPriorityShiftType = minShiftTypePriority;
                }
            }

            var shiftTypeWithGivenPriority = allShiftTypes.FirstOrDefault(s => s.Priority == currentPriorityShiftType);
            var indexOfShiftType = allShiftTypes.IndexOf(shiftTypeWithGivenPriority);

            return (indexOfShiftType, lastRotationDays);
            
        }

        private void FillScheduleHighestEmployeesFirstAndSecondShiftsTemplate(List<Schedule> schedules, Location location, List<IGrouping<int, DateTime>> datesGroupedByWeek, List<ShiftType> allShiftTypes, Employee employee, int firstShiftIndex)
        {
            var firstDateOfMonth = datesGroupedByWeek.First().First();
            var currentShiftTypeIndex = GetNextShiftTypeForFirstAndSecondShiftsTemplate(location.Id, firstDateOfMonth, allShiftTypes, employee);
            if(currentShiftTypeIndex == -1)
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

                    schedules.Add(new Schedule
                    {
                        Location = location,
                        Employee = employee,
                        ShiftType = currentShiftType,
                        Date = date
                    });
                }

                currentShiftTypeIndex++;
                if (currentShiftTypeIndex >= countOfShiftTypes)
                {
                    currentShiftTypeIndex = 0;
                }
            }
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

                schedules.Add(new Schedule
                {
                    Location = location,
                    Employee = employee,
                    ShiftType = currentShiftType,
                    Date = tempDate
                });

                tempRotationDays += 1;
                tempDate = tempDate.AddDays(-1);
            }
        }

        public double GetCountOfUnnecessaryShifts(Employee employee, DateTime startDate, List<Schedule> schedules, ShiftTypesTemplate shiftTypesTemplate)
        {
            var shiftHours = shiftTypesTemplate == ShiftTypesTemplate.TwelveHours ? 12 : 8;
            var workingHoursForMonth = CalculateWorkingHoursForMonth(startDate);
            var schedulesOfEmployee = schedules.Where(s => s.Employee == employee).ToList();
            var totalWorkingHours = schedulesOfEmployee.Sum(t => t.ShiftType.TotalHours);
            var overWorkingHours = totalWorkingHours - workingHoursForMonth;
            var unnecessaryShifts = Math.Floor(overWorkingHours / shiftHours);

            return unnecessaryShifts;
        }

        public double CalculateWorkingHoursForMonthByEmployee(Employee employee, DateTime startDate, List<Schedule> schedules)
        {
            var workingHoursForMonth = CalculateWorkingHoursForMonth(startDate);
            var test = schedules.Where(s => s.Employee == employee).ToList();
            var totalWorkingHours = test.Sum(t => t.ShiftType.TotalHours);
            var overWorkingHours = totalWorkingHours - workingHoursForMonth;
            var unnecessaryShifts = Math.Floor(overWorkingHours / 12);
            var resultOverWorkingHours = overWorkingHours - (unnecessaryShifts * 12);

            // ако са над 11 трябва да се вземе още сигурно 

            return unnecessaryShifts;
        }

        public void RemoveUnneccessaryShiftsTwelveHours(Employee employee, Location location, List<Schedule> schedules, double unnecessaryShifts, IGrouping<int, Employee?> otherGroupEmployees)
        {
            var schedulesForEmployee = schedules.Where(s => s.Employee == employee).OrderBy(s => s.Date.Date).ToList();
            var defaultBreakShiftType = shiftTypeService.GetDefaultBreakShiftType();
            var shiftTypeHighestPriority = schedulesForEmployee.Where(s => s.ShiftType.Priority != 0).OrderBy(s => s.ShiftType.Priority).First().ShiftType.Priority;
            var schedulesWithShiftTypeHighestPriority = schedulesForEmployee.Where(s => s.ShiftType.Priority == shiftTypeHighestPriority).ToList();

            for (int i = 0; i < unnecessaryShifts; i++)
            {
                var previousShiftType = schedulesWithShiftTypeHighestPriority[i].ShiftType;
                var date = schedulesWithShiftTypeHighestPriority[i].Date;
                var currentIndex = i;
                var otherEmployee = GetOtherEmployee(schedules, otherGroupEmployees, previousShiftType, date);
                while(otherEmployee == null)
                {
                    currentIndex++;
                    if(currentIndex >= schedulesWithShiftTypeHighestPriority.Count)
                    {
                        return;
                    }

                    previousShiftType = schedulesWithShiftTypeHighestPriority[currentIndex].ShiftType;
                    date = schedulesWithShiftTypeHighestPriority[currentIndex].Date;
                    otherEmployee = GetOtherEmployee(schedules, otherGroupEmployees, previousShiftType, date);
                }
                schedulesWithShiftTypeHighestPriority[currentIndex].ShiftType = defaultBreakShiftType;

                schedules.Add(new Schedule
                {
                    Location = location,
                    Employee = otherEmployee,
                    ShiftType = previousShiftType,
                    Date = date
                });
                currentIndex = i;
            }

        }

        public void RemoveUnneccessaryFirstAndSecondShiftsTemplate(Employee employee, Location location, List<Schedule> schedules, double unnecessaryShifts, IGrouping<int, Employee?> otherGroupEmployees, List<IGrouping<int, DateTime>> datesGroupedByWeek, List<ShiftType> allShiftTypes)
        {
            var firstShift = allShiftTypes[0];
            var secondShift = allShiftTypes[1];
            var schedulesForEmployee = schedules.Where(s => s.Employee == employee).OrderBy(s => s.Date.Date).ToList();
            var defaultBreakShiftType = shiftTypeService.GetDefaultBreakShiftType();

            for (int i = 0; i < unnecessaryShifts; i++)
            {
                var dateGroupIndex = i + 1;
                if (datesGroupedByWeek.Count <= dateGroupIndex)
                {
                    dateGroupIndex = 0;
                }
                var firstTwoDatesFromWeek = GetFirstTwoDatesFromWeek(datesGroupedByWeek[dateGroupIndex]);
                if (firstTwoDatesFromWeek.Count != 2)
                {
                    return;
                }
                var previousShiftType = schedulesForEmployee.FirstOrDefault(s => s.Date.Date == firstTwoDatesFromWeek[0].Date)?.ShiftType;
                if (previousShiftType.Id == firstShift.Id)
                {
                    var date = firstTwoDatesFromWeek[0];
                    var otherEmployee = GetOtherEmployee(schedules, otherGroupEmployees, previousShiftType, date);

                    schedulesForEmployee.First(s => s.Date.Date == date.Date).ShiftType = defaultBreakShiftType;

                    schedules.Add(new Schedule
                    {
                        Location = location,
                        Employee = otherEmployee,
                        ShiftType = previousShiftType,
                        Date = date
                    });
                }
                else
                {
                    var date = firstTwoDatesFromWeek[1];
                    var otherEmployee = GetOtherEmployee(schedules, otherGroupEmployees, previousShiftType, date);

                    schedulesForEmployee.First(s => s.Date.Date == date.Date).ShiftType = defaultBreakShiftType;

                    schedules.Add(new Schedule
                    {
                        Location = location,
                        Employee = otherEmployee,
                        ShiftType = previousShiftType,
                        Date = date
                    });
                }


            }

        }

        private List<DateTime> GetFirstTwoDatesFromWeek(IGrouping<int, DateTime> week)
        {
            var holidaysDates = settingsService.GetSettings().Holidays.Select(h => h.Date);

            var result = new List<DateTime>();
            foreach (var date in week)
            {
                if (date.DayOfWeek != DayOfWeek.Monday && date.DayOfWeek != DayOfWeek.Tuesday)
                    continue;

                if (result.Count == 2)
                    break;

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
            return !schedules.Any(s => s.Date == date && s.Employee == employee);
        }

        public bool IsEmployeeWorkLastFourDays(DateTime date, Employee employee, List<Schedule> schedulers)
        {
            return schedulers.Where(s => s.Date >= date.AddDays(-4) && s.Date <= date && s.Employee == employee).Count() == 4;
        }

        public void FillWithBreak(Location location, DateTime date, Employee employee, List<Schedule> schedules)
        {
            var breakShiftType = shiftTypeService.GetDefaultBreakShiftType();

            schedules.Add(new Schedule
            {
                Location = location,
                Employee = employee,
                ShiftType = breakShiftType,
                Date = date
            });
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
            var schedulesForEmployee = schedules.Where(s => s.Employee == employee).OrderBy(s => s.Date.Date).ToList();
            var startDate = GetFirstDateOfWeekFromDate(date);
            var endDate = startDate.AddDays(6);

            var weekHours = schedulesForEmployee.Where(t => t.Date >= startDate && t.Date <= endDate).Sum(s => s.ShiftType.TotalHours);

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
                var lastMonthShiftType = allShiftTypes.FirstOrDefault(s => s.Id == lastMonthShiftTypeId);

                return allShiftTypes.IndexOf(lastMonthShiftType);
            }

            var previousMonth = startDate.AddMonths(-1);
            var dates = Enumerable.Range(1, DateTime.DaysInMonth(startDate.Year, previousMonth.Month))  // Days: 1, 2 ... 31 etc.
                             .Select(day => new DateTime(startDate.Year, previousMonth.Month, day)) // Map each day to a date
                             .ToList(); // Load dates into a list;

            var mondays = dates.Where(d => d.DayOfWeek == DayOfWeek.Monday).OrderBy(d => d.Date).ToList();
            var lastMonday = mondays.Last();

            if(startDate.DayOfWeek == DayOfWeek.Saturday || startDate.DayOfWeek == DayOfWeek.Sunday)
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
    }
}
