﻿namespace SuperSchedule.Database.Models
{
    public class Position
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Abbreviation { get; set; }

        public int Priority { get; set; }

        public bool IsDeleted { get; set; }
    }
}
