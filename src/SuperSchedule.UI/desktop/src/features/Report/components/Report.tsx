import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Box from "@mui/material/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import PrintIcon from "@mui/icons-material/Print";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import locale from "date-fns/locale/bg";

import styles from "./Report.module.scss";
import moment from "moment";
import { getReport } from "../api/getReport";
import { getReportMonths } from "../api/getReportMonths";
import { UndrawNoReportSvg } from "../../../components/Svgs";
import { exportPDFReport } from "../utils/exportPDFReport";

const useStyles = makeStyles({
  tableHeader: {
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: "#405261",
      border: "1px solid grey",
    },
  },
  tableCell: {
    padding: "5px",
    textAlign: "center",
    border: "1px solid grey",
    fontSize: "0.95em",
  },
  customTableContainer: {
    overflowX: "initial",
  },
});

type ReportMonth = {
  id: number;
  name: string;
  monthWorkingHours: number;
};

type ReportEmployeeMonth = {
  id: number;
  overtimeHours: string;
};

type Report = {
  id: number;
  fullName: string;
  reportMonths: ReportEmployeeMonth[];
  result: string;
};

export const Report = () => {
  const classes = useStyles();
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(
    moment().add(-3, "months").toDate()
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(
    moment().toDate()
  );

  const [reports, setReports] = useState<Report[]>([]);
  const [reportMonths, setReportMonths] = useState<ReportMonth[]>([]);

  useEffect(() => {
    const stringFromMonthDate = moment(filterStartDate).format("YYYY-MM-DD");
    const stringToMonthDate = moment(filterEndDate).format("YYYY-MM-DD");

    const getDataReport = () => {
      getReport({
        fromMonth: stringFromMonthDate,
        toMonth: stringToMonthDate,
      }).then((response) => {
        const reports: Report[] = response.data;
        setReports(reports);
      });
    };

    const getDataReportMonths = () => {
      getReportMonths({
        fromMonth: stringFromMonthDate,
        toMonth: stringToMonthDate,
      }).then((response) => {
        const reportMonths: ReportMonth[] = response.data;
        setReportMonths(reportMonths);
      });
    };

    getDataReport();
    getDataReportMonths();
  }, [filterStartDate, filterEndDate]);

  return (
    <div className={styles.Report}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
        <Box className={styles.DatesContainer}>
          <DatePicker
            inputFormat="MM.yyyy"
            views={["year", "month"]}
            label="От месец"
            mask="__.____"
            minDate={new Date("2020-01-01")}
            value={filterStartDate}
            onChange={setFilterStartDate}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
          <DatePicker
            inputFormat="MM.yyyy"
            views={["year", "month"]}
            label="До месец"
            mask="__.____"
            minDate={new Date("2020-01-01")}
            value={filterEndDate}
            onChange={setFilterEndDate}
            renderInput={(params) => (
              <TextField
                {...params}
                className={styles.DatePicker}
                helperText={null}
              />
            )}
          />
        </Box>
      </LocalizationProvider>
      <IconButton
        aria-label="print"
        onClick={() => exportPDFReport("table", filterStartDate, filterEndDate)}
      >
        <PrintIcon />
      </IconButton>
      {reports.length !== 0 ? (
        <TableContainer
          className={`${styles.Table} ${classes.customTableContainer}`}
        >
          <Table stickyHeader={true} id="table">
            <TableHead>
              <TableRow className={classes.tableHeader}>
                <TableCell
                  rowSpan={2}
                  className={`${styles.TableCell} ${classes.tableCell}`}
                >
                  No
                </TableCell>
                <TableCell
                  rowSpan={2}
                  className={`${styles.TableCell} ${classes.tableCell}`}
                >
                  Име, фамилия
                </TableCell>
                {reportMonths.map((reportMonth, key) => {
                  return (
                    <TableCell
                      key={key}
                      className={`${styles.TableCell} ${classes.tableCell} ${styles.FixedColumns}`}
                    >
                      {reportMonth.name}
                    </TableCell>
                  );
                })}
                <TableCell
                  className={`${styles.TableCell} ${classes.tableCell} ${styles.FixedColumns}`}
                >
                  Резултат
                </TableCell>
              </TableRow>
              <TableRow className={classes.tableHeader}>
                {reportMonths.map((reportMonth, key) => {
                  return (
                    <TableCell
                      key={key}
                      className={`${styles.TableCell} ${classes.tableCell} ${styles.SecondRowFixedColumns}`}
                    >
                      {reportMonth.monthWorkingHours}
                    </TableCell>
                  );
                })}
                <TableCell
                  className={`${styles.TableCell} ${classes.tableCell} ${styles.SecondRowFixedColumns}`}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report, key) => {
                return (
                  <TableRow key={key}>
                    <TableCell
                      className={`${styles.TableCell} ${classes.tableCell}`}
                    >
                      {report.id}
                    </TableCell>
                    <TableCell
                      className={`${styles.TableCell} ${classes.tableCell}`}
                    >
                      {report.fullName}
                    </TableCell>
                    {report.reportMonths.map((reportMonth, key) => {
                      return (
                        <TableCell
                          key={key}
                          className={`${styles.TableCell} ${classes.tableCell}`}
                        >
                          {reportMonth.overtimeHours}
                        </TableCell>
                      );
                    })}
                    <TableCell
                      className={`${styles.TableCell} ${classes.tableCell}`}
                    >
                      {report.result}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className={styles.NoReports}>
          <UndrawNoReportSvg />
          <h5>Няма отчет за избрания период</h5>
        </div>
      )}
    </div>
  );
};
