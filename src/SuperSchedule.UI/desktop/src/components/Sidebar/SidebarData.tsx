import React from "react";

import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import BadgeIcon from "@mui/icons-material/Badge";
import SummarizeIcon from "@mui/icons-material/Summarize";
import SettingIcon from "@mui/icons-material/Settings";

export const SidebarData = [
  {
    title: "График",
    icon: <EventIcon />,
    link: "",
    submenu: [
      {
        title: "Нов график",
        link: "/createSchedule",
      },
      {
        title: "График",
        link: "/schedule",
      },
      {
        title: "Лични графици",
        link: "/personalSchedules",
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
        link: "/createEmployee",
      },
      {
        title: "Служители",
        link: "/employees",
      },
      {
        title: "Отпуски и болнични",
        link: "/leavesAndSickLeave",
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
        link: "/createShiftType",
      },
      {
        title: "Смени",
        link: "/shiftTypes",
      },
    ],
  },
  {
    title: "Позиции",
    icon: <BadgeIcon />,
    link: "",
    submenu: [
      {
        title: "Нова позиция",
        link: "/createPosition",
      },
      {
        title: "Позиции",
        link: "/positions",
      },
    ],
  },
  {
    title: "Обекти",
    icon: <LocationCityIcon />,
    link: "",
    submenu: [
      {
        title: "Нов обект",
        link: "/createLocation",
      },
      {
        title: "Обекти",
        link: "/locations",
      },
    ],
  },
  {
    title: "Отчет",
    icon: <SummarizeIcon />,
    link: "/report",
    submenu: [],
  },
  {
    title: "Настройки",
    icon: <SettingIcon />,
    link: "/settings",
    submenu: [],
  },
];
