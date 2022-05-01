import React from "react";

import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import SettingIcon from "@mui/icons-material/Settings";

export const SidebarData = [
  {
    title: "График",
    icon: <EventIcon />,
    link: "/",
  },
  {
    title: "Служители",
    icon: <GroupIcon />,
    link: "/employees",
  },
  {
    title: "Смени",
    icon: <PublishedWithChangesIcon />,
    link: "/shiftTypes",
  },
  {
    title: "Настройки",
    icon: <SettingIcon />,
    link: "/settings",
  },
];
