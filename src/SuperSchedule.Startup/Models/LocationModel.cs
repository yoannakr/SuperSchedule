﻿using SuperSchedule.Database.Enums;

namespace SuperSchedule.Startup.Models
{
    public class LocationModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Abbreviation { get; set; }

        public int ShiftTypesTemplate { get; set; }
    }
}
