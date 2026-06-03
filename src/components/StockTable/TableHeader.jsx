import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const COLUMNS = [
  { key: 'rank', label: '#', sortable: true, width: '48px' },
  { key: 'ticker', label: 'Mã CP', sortable: true },
  { key: 'change_3m', label: '3 Tháng', sortable: true },
  { key: 'change_6m', label: '6 Tháng', sortable: true },
  { key: 'chart', label: 'Biểu đồ', sortable: false },
];

export default function TableHeader({ sortKey, sortDir, onSort }) {
  return (
    <thead>
      <tr>
        {COLUMNS.map((col) => (
          <th
            key={col.key}
            className={`${col.sortable ? 'sortable' : ''} ${sortKey === col.key ? 'sorted' : ''}`}
            style={{ width: col.width }}
            onClick={() => col.sortable && onSort(col.key)}
          >
            <div className="th-content">
              {col.label}
              {col.sortable && (
                <span className="sort-icon">
                  {sortKey === col.key ? (
                    sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                  ) : (
                    <ArrowUpDown size={12} />
                  )}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
