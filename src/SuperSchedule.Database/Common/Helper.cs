namespace SuperSchedule.Database.Common
{
    public static class Helper
    {
        public static IEnumerable<DateTime> GetRangeOfDates(int start, DateTime startDate, DateTime endDate)
        {
            return Enumerable.Range(start, 1 + endDate.Subtract(startDate).Days)
                                    .Select(offset => startDate.AddDays(offset))
                                    .ToList();
        }
    }
}
