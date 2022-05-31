import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid as DataGridMui, bgBG } from "@mui/x-data-grid";
import { bgBG as coreBgBG } from "@mui/material/locale";

import "../../App.css";

type DataGridProps = {
  className?: string;
  columns: any;
  rows: any;
  onSelectionModelChange?: any;
  selectionModel?: any;
};

export const DataGrid = (props: DataGridProps) => {
  const { className, columns, rows, onSelectionModelChange, selectionModel } =
    props;

  const theme = createTheme(
    {
      palette: {
        primary: { main: "#1976d2" },
      },
    },
    bgBG, // x-data-grid translations
    coreBgBG // core translations
  );

  return (
    <ThemeProvider theme={theme}>
      <DataGridMui
        className={className}
        columns={columns}
        rows={rows}
        onSelectionModelChange={onSelectionModelChange}
        selectionModel={selectionModel}
        disableVirtualization={true}
      />
    </ThemeProvider>
  );
};
