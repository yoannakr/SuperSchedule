import React, { useState } from "react";

import styles from "./Sidebar.module.scss";
import { SidebarData } from "./SidebarData";
import { MenuItem } from "./MenuItem";

export const Sidebar = () => {
  return (
    <div className={styles.Sidebar}>
      <ul className={styles.SidebarList}>
        {SidebarData.map((val, key) => {
          return <MenuItem key={key} item={val} />;
        })}
      </ul>
    </div>
  );
};
