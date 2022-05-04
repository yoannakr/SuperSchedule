﻿namespace SuperSchedule.Database.Models
{
    public class Schedule
    {
        public int Id { get; set; }

        public Location Location { get; set; }

        public Employee Employee { get; set; }

        public ShiftType? ShiftType { get; set; }

        public DateTime Date { get; set; }
    }
}