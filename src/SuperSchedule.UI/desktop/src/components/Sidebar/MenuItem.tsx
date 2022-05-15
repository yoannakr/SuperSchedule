import React, { useState } from "react";

import styles from "./Sidebar.module.scss";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";

export type MenuItemModel = {
  link: string;
  icon: any;
  title: string;
  submenu: Submenu[];
};

type Submenu = {
  link: string;
  title: string;
};

type MenuItemProps = {
  item: MenuItemModel;
};

export const MenuItem = (props: MenuItemProps) => {
  const { item } = props;
  const [isSubMenuShown, setIsSubMenuShown] = useState<boolean>(false);

  return (
    <>
      {item.submenu.length !== 0 && (
        <li
          className={styles.Row}
          id={window.location.pathname === item.link ? "active" : ""}
        >
          <div id={styles.icon}>{item.icon}</div>{" "}
          <div id={styles.title}>{item.title}</div>
          {!isSubMenuShown ? (
            <IconButton onClick={() => setIsSubMenuShown(!isSubMenuShown)}>
              <ArrowDropDownIcon className={styles.ArrowButton} />
            </IconButton>
          ) : (
            <IconButton onClick={() => setIsSubMenuShown(!isSubMenuShown)}>
              <ArrowDropUpIcon className={styles.ArrowButton} />
            </IconButton>
          )}
        </li>
      )}
      {item.submenu.length === 0 && (
        <Link
          className={styles.Row}
          id={window.location.pathname === item.link ? "active" : ""}
          to={item.link}
        >
          <div id={styles.icon}>{item.icon}</div>{" "}
          <div id={styles.title}>{item.title}</div>
        </Link>
      )}
      {item.submenu.length !== 0 && isSubMenuShown && (
        <ul className={styles.Submenu}>
          {item.submenu.map((subItem, subKey) => (
            <Link key={subKey} className={styles.SubmenuItem} to={subItem.link}>
              <div id={styles.title}>{subItem.title}</div>
            </Link>
          ))}
        </ul>
      )}
    </>
  );
};
