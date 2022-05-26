import React, { useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import styles from "./Sidebar.module.scss";
import { SidebarData } from "./SidebarData";
import { MenuItem } from "./MenuItem";

type SidebarOptions = {
  onExit: any;
  isAdmin: boolean;
};

export const Sidebar = (props: SidebarOptions) => {
  const { onExit, isAdmin } = props;
  const menuItems = isAdmin
    ? SidebarData
    : SidebarData.filter((i) => i.isOnlyForAdmin === false);

  return (
    <div className={styles.Sidebar}>
      <ul className={styles.SidebarList}>
        {menuItems.map((val, key) => {
          return <MenuItem key={key} item={val} />;
        })}
        <button
          className={`${styles.ExitButton} ${styles.Row}`}
          onClick={onExit}
        >
          <div id={styles.icon}>
            <ExitToAppIcon />
          </div>{" "}
          <div className={styles.ExitTitle}>Изход</div>
        </button>
      </ul>
    </div>
  );
};
