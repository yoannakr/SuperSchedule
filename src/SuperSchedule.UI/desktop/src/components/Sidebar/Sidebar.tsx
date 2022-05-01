import React from "react";
import { Link } from "react-router-dom";

import styles from "./Sidebar.module.scss";
import { SidebarData } from "./SidebarData";

export const Sidebar = () => {
  return (
    <div className={styles.Sidebar}>
      <ul className={styles.SidebarList}>
        {SidebarData.map((val, key) => {
          return (
            <li
              className={styles.Row}
              key={key}
              id={window.location.pathname === val.link ? "active" : ""}
              onClick={() => {
                window.location.pathname = val.link;
              }}
            >
              <div id={styles.icon}>{val.icon}</div>{" "}
              <div id={styles.title}>{val.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
