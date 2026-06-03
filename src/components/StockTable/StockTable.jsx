import { useState, useMemo } from 'react';
import TableHeader from './TableHeader';
import StockRow from './StockRow';
import LoadingSpinner from '../Common/LoadingSpinner';
import { FileX } from 'lucide-react';

export default function StockTable({ stocks, loading, searchQuery }) {
  const [sortKey, setSortKey] = useState('rank');
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'rank' ? 'asc' : 'desc');
    }
  };

  const filtered = useMemo(() => {
    if (!searchQuery) return stocks;
    const q = searchQuery.toLowerCase().trim();
    return stocks.filter((s) => s.ticker.toLowerCase().includes(q));
  }, [stocks, searchQuery]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortKey] ?? -Infinity;
      let bVal = b[sortKey] ?? -Infinity;
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [filtered, sortKey, sortDir]);

  if (loading) return <LoadingSpinner text="Đang tải dữ liệu cổ phiếu..." />;

  if (!loading && stocks.length === 0) {
    return (
      <div className="table-empty">
        <FileX size={48} color="var(--text-muted)" />
        <h3>Chưa có dữ liệu</h3>
        <p>Upload file Excel để bắt đầu xem dữ liệu cổ phiếu</p>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="table-empty">
        <FileX size={40} color="var(--text-muted)" />
        <h3>Không tìm thấy</h3>
        <p>Không có cổ phiếu nào khớp với từ khóa "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="stock-table">
        <TableHeader sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
        <tbody>
          {sorted.map((stock, idx) => (
            <StockRow key={stock.id} stock={stock} index={idx} />
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <span>Hiển thị {sorted.length}/{stocks.length} cổ phiếu</span>
      </div>
    </div>
  );
}
