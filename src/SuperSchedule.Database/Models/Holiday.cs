namespace SuperSchedule.Database.Models
{
    public class Holiday
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public Setting Setting { get; set; }
    }
}
