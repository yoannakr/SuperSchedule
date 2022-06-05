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

        public static List<DateTime> GetMonthsBetween(DateTime from, DateTime to)
        {
            if (from > to) return GetMonthsBetween(to, from);

            var monthDiff = Math.Abs((to.Year * 12 + (to.Month - 1)) - (from.Year * 12 + (from.Month - 1)));

            if (from.AddMonths(monthDiff) > to || to.Day < from.Day)
            {
                monthDiff -= 1;
            }

            List<DateTime> results = new List<DateTime>();
            for (int i = monthDiff; i >= 1; i--)
            {
                results.Add(to.AddMonths(-i));
            }

            return results;
        }
    }
}
