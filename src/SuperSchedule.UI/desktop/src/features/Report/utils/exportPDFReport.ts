import { createPdfFile } from "../../../utils/createPdfFile";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { getArrayInRange } from "../../Schedule/utils/getArrayInRange";

export const exportPDFReport = (
  tableId: string,
  firstMonth: Date | null,
  lastMonth: Date | null
) => {
  const doc = createPdfFile();
  const months = getArrayInRange(
    firstMonth?.getMonth() ?? 0,
    lastMonth?.getMonth() ?? 0
  );
  const title = `ЧАСОВЕ ${months.map(
    (m) => `${m + 1}`
  )} - ${firstMonth?.getFullYear()}`;

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  doc.text(title, width / 2, 40, { align: "center" });

  autoTable(doc, {
    theme: "plain",
    html: `#${tableId}`,
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
      top: 80,
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
