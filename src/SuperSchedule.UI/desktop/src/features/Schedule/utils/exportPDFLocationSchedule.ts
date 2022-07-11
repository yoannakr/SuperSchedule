import { createPdfFile } from "../../../utils/createPdfFile";
import autoTable from "jspdf-autotable";
import moment from "moment";

export const exportPDFLocationSchedule = (
  tableId: string,
  monthDate: Date | null,
  locationName: string,
  secretaryName: string,
  managerName: string
) => {
  const marginLeft = 40;
  const doc = createPdfFile();
  const title = "УТВЪРЖДАВАМ";
  const name = `Гл.Секретар: ${secretaryName}`;

  const schedule = "ГРАФИК";
  const desription = "за дежурствата на охранителите";
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

  doc.text(scheduleCanBeEditedfooter, marginLeft, height - 220);
  doc.text(madeByFirstRowFooter, marginLeft + 580, height - 220);
  doc.text(madeBySecondRowFooter, marginLeft + 580, height - 200);
  doc.text(madeByThirdRowFooter, marginLeft + 610, height - 180);

  autoTable(doc, {
    theme: "plain",
    html: `#${tableId}`,
    headStyles: {
      halign: "center",
      valign: "middle",
      lineWidth: 0.25,
      lineColor: 200,
    },
    bodyStyles: {
      halign: "center",
      lineWidth: 0.25,
      lineColor: 200,
    },
    margin: {
      top: 140,
    },
    styles: {
      font: "PTSans-Regular",
    },
  });

  doc.save(`${locationName} - ${moment(monthDate).format("MM.yyyy")}.pdf`);
};
