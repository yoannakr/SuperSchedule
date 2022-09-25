import { createPdfFile } from "../../../utils/createPdfFile";
import autoTable from "jspdf-autotable";
import moment from "moment";

export const exportPDFByPassedSchedule = (
  tableId: string,
  monthDate: Date | null,
  locationName: string,
  secretaryName: string,
  managerName: string
) => {
  const marginLeft = 40;
  const doc = createPdfFile("portrait", "A2");
  const title = "УТВЪРЖДАВАМ";
  const name = `Гл.Секретар: ${secretaryName}`;

  const schedule = "ГРАФИК";
  const desription = "за дежурствата на обходните охранители";
  const month = `месец ${
    (monthDate?.getMonth() ?? 0) + 1
  }. ${monthDate?.getFullYear()}г`;

  const scheduleCanBeEditedfooter = "гх графикът се коригира при необходимост";
  const madeByFirstRowFooter = "Изготвил:";
  const madeBySecondRowFooter = 'Р-л отдел "Без. и охрана"';
  const madeByThirdRowFooter = `/${managerName}/`;

  doc.text(title, marginLeft, 40);
  doc.text(name, marginLeft, 60);
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  doc.text(schedule, width / 2, 80, { align: "center" });
  doc.text(desription, width / 2, 100, { align: "center" });
  doc.text(month, width / 2, 120, { align: "center" });

  //   doc.text(scheduleCanBeEditedfooter, marginLeft, height - 1050);
  //   doc.text(madeByFirstRowFooter, marginLeft + 580, height - 550);
  //   doc.text(madeBySecondRowFooter, marginLeft + 580, height - 200);
  //   doc.text(madeByThirdRowFooter, marginLeft + 610, height - 180);

  let tableMeta: any = null;

  autoTable(doc, {
    theme: "plain",
    html: `#${tableId}`,
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 90 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 30 },
      6: { cellWidth: 30 },
      7: { cellWidth: 30 },
      8: { cellWidth: 30 },
      9: { cellWidth: 30 },
      10: { cellWidth: 30 },
      11: { cellWidth: 30 },
      12: { cellWidth: 30 },
      13: { cellWidth: 30 },
      14: { cellWidth: 30 },
      15: { cellWidth: 30 },
      16: { cellWidth: 30 },
      17: { cellWidth: 30 },
      18: { cellWidth: 30 },
      19: { cellWidth: 30 },
      20: { cellWidth: 30 },
      21: { cellWidth: 30 },
      22: { cellWidth: 30 },
      23: { cellWidth: 30 },
      24: { cellWidth: 30 },
      25: { cellWidth: 30 },
      26: { cellWidth: 30 },
      27: { cellWidth: 30 },
      28: { cellWidth: 30 },
      29: { cellWidth: 30 },
      30: { cellWidth: 30 },
      31: { cellWidth: 30 },
      32: { cellWidth: 30 },
    },
    headStyles: {
      halign: "center",
      valign: "middle",
      lineWidth: 0.25,
      lineColor: [0, 0, 0],
    },
    bodyStyles: {
      halign: "center",
      lineWidth: 0.25,
      lineColor: [0, 0, 0],
    },
    margin: {
      top: 140,
    },
    styles: {
      font: "PTSans-Regular",
    },
    didDrawPage: (data) => {
      tableMeta = data.table;
    },
  });

  doc.text(scheduleCanBeEditedfooter, marginLeft, tableMeta.finalY + 40);
  doc.text(madeByFirstRowFooter, marginLeft + 800, tableMeta.finalY + 40);
  doc.text(madeBySecondRowFooter, marginLeft + 800, tableMeta.finalY + 60);
  doc.text(madeByThirdRowFooter, marginLeft + 830, tableMeta.finalY + 80);

  doc.save(`${locationName} - ${moment(monthDate).format("MM.yyyy")}.pdf`);
};
