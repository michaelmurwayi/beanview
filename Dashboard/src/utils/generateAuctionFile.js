import * as XLSX from 'xlsx';

/**
 * Generate an Excel file from raw coffee records.
 * Handles nested fields like `farmer.name`, etc.
 * @param {Array} records - Flat array of coffee records
 * @returns {{ fileBlob: Blob, filename: string }}
 */
export const generateAuctionFileFromData = (records) => {
  if (!Array.isArray(records)) {
    throw new Error('Invalid input: records must be an array');
  }

  // Define the headers and the exact keys to extract (flat or nested)
  const headers = [
    'LOT',
    'MARK ',
    'GRADE',
    'BAGS',
    'POCKETS',
    'WEIGHT',
    'SALE',
    'SEASON',
    'CERTIFICATE',
    'AGENT_CODE',
    'PRICE',
    'REMARKS',
  ];

  // Convert each record into a row
  console.log("Generating auction file with records:", records);
  const data = [
    headers,
    ...records.map((rec) => {
      return [
        rec.lot || '',  
        rec.mark || '',
        rec.grade || '',
        rec.bags || '',
        rec.pockets || '',
        rec.weight || '',
        rec.sale || '',
        rec.season || '',
        rec.certificate || '',
        rec.agent_code || '',
        rec.price || '',
      ];
    }),
  ];
  
  // Create worksheet & workbook
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Auction Summary');
  
  // Convert workbook to blob
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  
  const filename = `Auction_Summary_${new Date().toISOString().slice(0, 10)}.xlsx`;
  console.log("Processing record:");
  return { fileBlob: blob, filename };
};
