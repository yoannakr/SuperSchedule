import React from "react";
import { TabList as TabListMui } from "@mui/lab";
import Tab from "@mui/material/Tab";

import styles from "./Schedule.module.scss";

export type TabItem = {
  value: string;
  label: string;
};

type TabListOptions = {
  onChange: any;
  items: TabItem[];
  selectedItem: string;
};

export const TabList = (props: TabListOptions) => {
  const { onChange, items, selectedItem } = props;

  return (
    <TabListMui
      className={styles.TabList}
      onChange={onChange}
      variant="scrollable"
      scrollButtons="auto"
      TabIndicatorProps={{
        style: {
          display: "none",
        },
      }}
    >
      {items.map((item, key) => (
        <Tab
          key={key}
          className={`${styles.Tab} ${
            selectedItem === item.value ? styles.SelectedTab : ""
          }`}
          value={item.value}
          label={item.label}
        />
      ))}
    </TabListMui>
  );
};
