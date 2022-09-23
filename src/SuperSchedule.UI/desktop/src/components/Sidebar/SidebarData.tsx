import React from "react";

import EventIcon from "@mui/icons-material/Event";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import BadgeIcon from "@mui/icons-material/Badge";
import SummarizeIcon from "@mui/icons-material/Summarize";
import SettingIcon from "@mui/icons-material/Settings";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export const SidebarData = [
  {
    title: "Графици",
    icon: <EventIcon />,
    link: "",
    isOnlyForAdmin: false,
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
      {
        title: "Обходен график",
        link: "/byPassedSchedule",
      },
    ],
  },
  {
    title: "Служители",
    icon: <ContactPageIcon />,
    link: "",
    isOnlyForAdmin: true,
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
    icon: <WorkHistoryIcon />,
    link: "",
    isOnlyForAdmin: true,
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
    isOnlyForAdmin: true,
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
    isOnlyForAdmin: true,
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
    isOnlyForAdmin: true,
    submenu: [],
  },
  {
    title: "Потребители",
    icon: <SupervisedUserCircleIcon />,
    link: "",
    isOnlyForAdmin: true,
    submenu: [
      {
        title: "Нов потребител",
        link: "/createUser",
      },
      {
        title: "Потребители",
        link: "/users",
      },
    ],
  },
  {
    title: "Настройки",
    icon: <SettingIcon />,
    link: "/settings",
    isOnlyForAdmin: true,
    submenu: [],
  },
];
