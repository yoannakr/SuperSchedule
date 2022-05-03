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
    link: "",
    submenu: [
      {
        title: "Нов график",
        link: "/schedule",
      },
      {
        title: "График",
        link: "/schedule",
      },
    ],
  },
  {
    title: "Служители",
    icon: <GroupIcon />,
    link: "",
    submenu: [
      {
        title: "Нов служител",
        link: "/addEmployee",
      },
      {
        title: "Служители",
        link: "/employees",
      },
    ],
  },
  {
    title: "Смени",
    icon: <PublishedWithChangesIcon />,
    link: "",
    submenu: [
      {
        title: "Нова смяна",
        link: "/addShiftType",
      },
      {
        title: "Смени",
        link: "/shiftTypes",
      },
    ],
  },
  {
    title: "Настройки",
    icon: <SettingIcon />,
    link: "/settings",
    submenu: [],
  },
];
