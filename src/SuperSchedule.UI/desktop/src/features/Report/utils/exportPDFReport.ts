import { createPdfFile } from "../../../utils/createPdfFile";
import autoTable from "jspdf-autotable";
import moment from "moment";

export const exportPDFReport = (
  tableId: string,
  firstMonth: Date | null,
  lastMonth: Date | null
) => {
  const marginLeft = 40;
  const doc = createPdfFile();

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

  doc.save(
    `Отчет за ${moment(firstMonth).format("MM.yyyy")} - ${moment(
      lastMonth
    ).format("MM.yyyy")}.pdf`
  );
};
