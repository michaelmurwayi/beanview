import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Generate and download stock summary Excel file.
 * @param {Object} groupedData - Data grouped by mark.
 */
export const generateSummaryExcel = (groupedData) => {
  const wb = XLSX.utils.book_new();

  Object.entries(groupedData).forEach(([mark, records]) => {
    const sheetData = [
      ['Outturn', 'Grade', 'Bags', 'Pockets', 'Weight', 'Status', 'Buyer'],
      ...records.map(rec => [
        rec.outturn,
        rec.grade,
        rec.bags,
        rec.pockets,
        rec.weight,
        rec.status,
        rec.buyer,
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, mark.substring(0, 31)); // Excel sheet name limit
  });

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const filename = `Stock_Summary_${new Date().toISOString().slice(0, 10)}.xlsx`;
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename);
};
