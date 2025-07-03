import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Generate and download stock summary Excel file using a template.
 * @param {Object} groupedData - Data grouped by mark.
 */
export const generateSummaryExcel = async (groupedData) => {
  try {
    // Load the predefined Excel template from public folder
    const response = await fetch('/templates/stock_template.xlsx');
    const templateBuffer = await response.arrayBuffer();
    const templateWorkbook = XLSX.read(templateBuffer, { type: 'array' });

    Object.entries(groupedData).forEach(([mark, records]) => {
      // Use the first sheet in the template
      const sheetName = templateWorkbook.SheetNames[0];
      const ws = templateWorkbook.Sheets[sheetName];

      // Set mark in cell B4
      ws['B4'] = { t: 's', v: mark };

      // Prepare rows without headers
      const sheetData = records.map(rec => [
        rec.outturn,
        rec.grade,
        rec.bags,
        rec.pockets,
        rec.weight,
        rec.status,
        rec.buyer,
      ]);

      // Write data starting from cell A26 (row 26)
      XLSX.utils.sheet_add_aoa(ws, sheetData, { origin: 'A26' });

      // Write updated workbook to file
      const output = XLSX.write(templateWorkbook, { bookType: 'xlsx', type: 'array' });
      const filename = `Stock_Summary_${mark}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      saveAs(new Blob([output], { type: 'application/octet-stream' }), filename);
    });
  } catch (err) {
    console.error('Error generating Excel summary:', err);
  }
};
