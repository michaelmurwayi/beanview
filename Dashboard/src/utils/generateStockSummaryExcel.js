import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Convert column index to Excel column letter (e.g., 0 -> A, 1 -> B).
 * @param {number} colIndex
 * @returns {string}
 */
const getColLetter = (colIndex) => {
  let letter = '';
  while (colIndex >= 0) {
    letter = String.fromCharCode((colIndex % 26) + 65) + letter;
    colIndex = Math.floor(colIndex / 26) - 1;
  }
  return letter;
};

/**
 * Generate and download stock summary Excel files using a template.
 * Overwrites the same sheet and updates values in-place to preserve formatting.
 * @param {Object} groupedData - Data grouped by mark.
 */
export const generateSummaryExcel = async (groupedData) => {
  try {
    // Load the Excel template from the public folder
    const response = await fetch('/templates/stock_template.xlsx');
    const templateBuffer = await response.arrayBuffer();

    for (const [mark, records] of Object.entries(groupedData)) {
      // Read the template anew each time to keep original styles intact
      const workbook = XLSX.read(templateBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const ws = workbook.Sheets[sheetName];

      // Set the mark in cell B4
      if (!ws['B4']) ws['B4'] = {};
      ws['B4'].t = 's';
      ws['B4'].v = mark;

      // Write values in-place starting at A26
      const startRow = 26;
      records.forEach((rec, index) => {
        const row = startRow + index;
        const rowValues = [
          rec.outturn,
          rec.grade,
          rec.bags,
          rec.pockets,
          rec.weight,
          rec.status,
          rec.buyer,
        ];

        rowValues.forEach((value, colIdx) => {
          const cellAddress = `${getColLetter(colIdx)}${row}`;
          if (!ws[cellAddress]) ws[cellAddress] = {};
          ws[cellAddress].t = 's';
          ws[cellAddress].v = String(value ?? '');
        });
      });

      // Export the modified workbook
      const output = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const filename = `Stock_Summary_${mark}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      saveAs(new Blob([output], { type: 'application/octet-stream' }), filename);
    }
  } catch (err) {
    console.error('Error generating Excel summary:', err);
  }
};
