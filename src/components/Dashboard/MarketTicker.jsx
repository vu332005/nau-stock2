// Market indices ticker - hiển thị VN-Index, HNX-Index, UPCOM dưới search bar
// Dữ liệu static (placeholder) - có thể mở rộng lấy live data
const INDICES = [
  { name: 'VN-INDEX', value: '1,284.56', change: '+0.82%', up: true },
  { name: 'HNX-INDEX', value: '223.18', change: '+0.45%', up: true },
  { name: 'UPCOM', value: '94.73', change: '-0.21%', up: false },
  { name: 'VN30', value: '1,312.44', change: '+0.91%', up: true },
  { name: 'VN100', value: '1,196.82', change: '+0.63%', up: true },
  // Lặp lại để scroll vô tận
  { name: 'VN-INDEX', value: '1,284.56', change: '+0.82%', up: true },
  { name: 'HNX-INDEX', value: '223.18', change: '+0.45%', up: true },
  { name: 'UPCOM', value: '94.73', change: '-0.21%', up: false },
  { name: 'VN30', value: '1,312.44', change: '+0.91%', up: true },
  { name: 'VN100', value: '1,196.82', change: '+0.63%', up: true },
];

export default function MarketTicker() {
  return (
    <div className="market-ticker">
      <div className="ticker-track">
        {[...INDICES, ...INDICES].map((idx, i) => (
          <div key={i} className="ticker-item">
            <span className="ticker-name">{idx.name}</span>
            <span className="ticker-value">{idx.value}</span>
            <span className={`ticker-change ${idx.up ? 'up' : 'down'}`}>
              {idx.change}
            </span>
            <span className="ticker-dot" />
          </div>
        ))}
      </div>
    </div>
  );
}
