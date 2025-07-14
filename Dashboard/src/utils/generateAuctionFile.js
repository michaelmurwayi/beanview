import * as XLSX from 'xlsx';

/**
 * Generate Excel file buffer (ArrayBuffer) from grouped data.
 * @param {Object} groupedData - Data grouped by mark.
 * @returns {Array<{ mark: string, fileBlob: Blob, filename: string }>}
 */
export const generateAuctionFileFromData = (groupedData) => {
  const files = [];

  for (const [mark, records] of Object.entries(groupedData)) {
    const wb = XLSX.utils.book_new();
    const headers = ['Outturn', 'Grade', 'Bags', 'Pockets', 'Weight', 'Status', 'Buyer'];

    const data = [headers, ...records.map((rec) => [
      rec.outturn,
      rec.grade,
      rec.bags,
      rec.pockets,
      rec.weight,
      rec.status,
      rec.buyer,
    ])];

    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Stock Summary');

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const filename = `Stock_Summary_${mark}_${new Date().toISOString().slice(0, 10)}.xlsx`;

    files.push({ mark, fileBlob: blob, filename });
  }

  return files;
};
