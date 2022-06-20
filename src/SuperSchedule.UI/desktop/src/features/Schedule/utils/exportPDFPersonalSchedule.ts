import { createPdfFile } from "../../../utils/createPdfFile";
import autoTable from "jspdf-autotable";
import moment from "moment";

export const exportPDFPersonalSchedule = (
  tableId: string,
  monthDate: Date | null,
  employeeName: string
) => {
  const marginLeft = 40;
  const doc = createPdfFile();
  const title = "УТВЪРЖДАВАМ";
  const name = "Гл.Секретар: маг.Н.Николов";

  const schedule = "ГРАФИК";
  const desription = "за дежурствата на охранителите";
  const month = `месец ${
    (monthDate?.getMonth() ?? 0) + 1
  }. ${monthDate?.getFullYear()}г`;

  const footer = "гх графикът се коригира при необходимост";

  doc.text(title, marginLeft, 40);
  doc.text(name, marginLeft, 60);
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  doc.text(schedule, width / 2, 80, { align: "center" });
  doc.text(desription, width / 2, 100, { align: "center" });
  doc.text(month, width / 2, 120, { align: "center" });

  doc.text(footer, marginLeft, height - 20);

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

  doc.save(`${employeeName} - ${moment(monthDate).format("MM.yyyy")}.pdf`);
};
