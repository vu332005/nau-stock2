import * as XLSX from 'xlsx';

/**
 * Parse Excel file có cấu trúc "BIẾN ĐỘNG TOP 100 VỐN HÓA"
 * Cột: Mã | 3 Tháng | 6 Tháng
 */
export function parseStockExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Lấy sheet đầu tiên
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sang array of arrays
        const rawData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: null,
          blankrows: false,
        });

        // Tìm title và header row
        let title = 'BIẾN ĐỘNG TOP 100 VỐN HÓA';
        let headerRowIndex = -1;
        let dataStartIndex = -1;

        for (let i = 0; i < rawData.length; i++) {
          const row = rawData[i];
          if (!row) continue;

          // Tìm title
          const rowText = row.join(' ').toUpperCase();
          if (rowText.includes('BIẾN ĐỘNG') || rowText.includes('VON HOA') || rowText.includes('VỐN HÓA')) {
            title = row.filter(Boolean).join(' ').trim() || title;
          }

          // Tìm header row (chứa "Mã" hoặc "MA")
          const hasTicker = row.some(
            (cell) => cell && String(cell).toUpperCase().replace(/\s/g, '') === 'MÃ' ||
                      cell && String(cell).toUpperCase().replace(/\s/g, '') === 'MA'
          );
          if (hasTicker) {
            headerRowIndex = i;
            dataStartIndex = i + 1;
            break;
          }
        }

        // Nếu không tìm được header, thử tìm theo pattern (mã ticker ngắn)
        if (dataStartIndex === -1) {
          for (let i = 0; i < rawData.length; i++) {
            const row = rawData[i];
            if (!row) continue;
            // Tìm row đầu tiên có cell là mã chứng khoán (2-4 ký tự uppercase)
            const firstCell = row.find(Boolean);
            if (firstCell && /^[A-Z]{2,5}$/.test(String(firstCell).trim())) {
              dataStartIndex = i;
              break;
            }
          }
        }

        if (dataStartIndex === -1) {
          // Fallback: skip rows đến khi gặp dữ liệu có vẻ là ticker
          dataStartIndex = 2;
        }

        // Parse stocks
        const stocks = [];
        let rank = 1;

        for (let i = dataStartIndex; i < rawData.length; i++) {
          const row = rawData[i];
          if (!row) continue;

          // Lọc ra các cell không null
          const cells = row.filter((cell) => cell !== null && cell !== undefined && cell !== '');

          if (cells.length < 2) continue;

          // Cell đầu tiên là mã ticker
          const ticker = String(cells[0]).trim().toUpperCase();

          // Bỏ qua nếu không phải mã hợp lệ (phải là 2-5 ký tự chữ)
          if (!/^[A-Z]{2,5}$/.test(ticker)) continue;

          // Parse % values - có thể là số hoặc string như "36.48%"
          const parsePercent = (val) => {
            if (val === null || val === undefined) return null;
            if (typeof val === 'number') return val * (Math.abs(val) > 1 ? 1 : 100); // nếu đã là decimal
            const str = String(val).replace('%', '').replace(',', '.').trim();
            const num = parseFloat(str);
            return isNaN(num) ? null : num;
          };

          const change3m = parsePercent(cells[1]);
          const change6m = parsePercent(cells[2] ?? null);

          stocks.push({
            ticker,
            change_3m: change3m,
            change_6m: change6m,
            rank,
          });
          rank++;
        }

        resolve({ title, stocks });
      } catch (err) {
        reject(new Error(`Lỗi đọc file Excel: ${err.message}`));
      }
    };

    reader.onerror = () => reject(new Error('Không thể đọc file'));
    reader.readAsArrayBuffer(file);
  });
}
